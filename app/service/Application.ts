import { Service } from 'egg';
import { AppConfig, CreateApplication } from '../dto/application.dto';
import crypto from 'crypto';
import { generateAppId } from '../utils/generateAppId';
import { HttpException, HttpStatus } from '../errors';
import ApplicationEntity from '../entities/Application';
import PermissionEntity from '../entities/Permission';
import { TokenIncludeInfo } from '../dto/tokenIncludeInfo.dto';


export class ApplicationService extends Service {
  async create({ name }: CreateApplication, { id }: TokenIncludeInfo) {
    const { Application, Permission, User } = this.ctx.repo;

    const userRecord = await User.findOne({ where: { id }, relations: ['permissions'] });

    if (!userRecord) {
      throw new HttpException(
        { message: '找不到用户', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }

    const appKey = crypto.randomBytes(16).toString('hex');
    const appId = generateAppId(8);

    const hasApp = await Application.findOne({ where: { name } });
    if (hasApp) {
      throw new HttpException(
        { message: 'app 名称重复', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }
    const appData = await Application.manager.transaction(async () => {

      const app = new ApplicationEntity();
      app.appId = appId;
      app.appKey = appKey;
      app.name = name;
      const appData = await Application.save(app);

      const adminPermission = this.creatPlatformPermission('admin', app);
      const commonPermission = this.creatPlatformPermission('common', app);
      await Permission.save(commonPermission);
      await Permission.save(adminPermission);

      userRecord.permissions = [...userRecord.permissions, adminPermission, commonPermission];
      await User.save(userRecord);

      return appData;
    });

    if (appData) {
      return appData;
    }

    throw new HttpException(
      { message: '新建应用失败', code: HttpStatus.INTERNAL_SERVER_ERROR },
      HttpStatus.OK,
    );
  }

  async deleteApplication(appId: string, userData: TokenIncludeInfo) {

    const { Application, Permission, User } = this.ctx.repo;

    // 查询要删除的应用
    const appToDelete = await Application.findOne({ where: { appId } });

    if (!appToDelete) {
      throw new HttpException(
        { message: '找不到要删除的应用', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }

    // 使用数据库事务执行删除操作
    const result = await Application.manager.transaction(async () => {

      // 查询与应用相关的权限
      const deletePermissions = await Permission.find({ where: { application: appToDelete } });

      // 删除应用的权限
      await Permission.remove(deletePermissions);
      const user = await User.findOne({ where: { id: userData.id }, relations: ['permissions'] });
      if (!user) {
        throw new HttpException(
          { message: '用户不存在', code: HttpStatus.BAD_REQUEST },
          HttpStatus.OK,
        );
      }

      user.permissions = user.permissions.filter(permission => {
        return deletePermissions.every(deletePermission => {
          return deletePermission.id !== permission.id;
        });
      });

      await User.save(user);

      // 最后，删除应用
      await Application.remove(appToDelete);

      return true; // 表示事务成功
    });

    if (result) {
      return '删除成功';
    }

    throw new HttpException(
      { message: '删除应用失败', code: HttpStatus.INTERNAL_SERVER_ERROR },
      HttpStatus.OK,
    );
  }

  creatPlatformPermission(name: PermissionEntity['name'], app: ApplicationEntity) {
    const permissions = new PermissionEntity();
    permissions.name = name;
    permissions.type = 'app';
    permissions.application = app;
    return permissions;
  }

  async validateAppConfig(appConfig: AppConfig) {
    const { Application } = this.ctx.repo;
    const { appId, appKey } = appConfig;
    const app = await Application.findOne({
      where: {
        appId,
      },
    });

    if (!app) {
      throw new HttpException(
        { message: '找不到此appId', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }

    if (app.appKey !== appKey) {
      throw new HttpException(
        { message: 'appKey错误', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }

    return true;
  }

  async validateHasApp(appId: string) {
    const { Application } = this.ctx.repo;

    const app = await Application.findOne({
      where: {
        appId,
      },
    });

    if (!app) {
      throw new HttpException(
        { message: '找不到此appId', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }
    return true
  }

  async getAppInfo(userId: TokenIncludeInfo['id'], appId: AppConfig['appId']) {
    const { Application } = this.ctx.repo;

    const userData = await this.service.user.getUserPermission(userId);

    if (!userData.app[appId]) {
      throw new HttpException(
        { message: '用户没有此app权限', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }

    return await Application.findOne({
      where: {
        appId,
      },
    });
  }

  async getAppList(userId: TokenIncludeInfo['id']) {
    const { Application } = this.ctx.repo;

    const userData = await this.service.user.getUserPermission(userId);

    const queryBuilder = Application.createQueryBuilder('app');

    // 只有在appIds非空时才添加查询条件 否者报错
    const appIds = Object.keys(userData.app);
    if (appIds.length > 0) {
      queryBuilder.andWhere('app.appId IN (:...fieldValues)', { fieldValues: appIds });
    }

    const appList = await queryBuilder
      .select(['app.name', 'app.appId', 'app.appKey'])
      .getMany();

    return appList.map(item => {
      const permission: string[] = [];
      const { admin, common } = userData.app[item.appId] || {};
      admin && permission.push('admin');
      common && permission.push('common');

      return {
        ...item,
        permission,
      };
    });
  }
}

export default ApplicationService;
