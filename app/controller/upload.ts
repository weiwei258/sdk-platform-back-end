import { Controller } from 'egg';
import { moveFile } from '../utils/moveFile';
import { DefaultConfig } from '../../config/config.default';
import { validateToken } from '../utils/validateToken';
import { validateParams } from '../utils/validator';
import { UploadForPlatformDTO, UploadForPlugin } from '../dto/upload.dto';

// in controller
export default class UploadController extends Controller {

  public async index() {
    const { ctx } = this;
    // const { path } = ctx.params;
    const { uploadFileAbsolutePath } = this.config as any as DefaultConfig;
    const files = ctx.request.files; // 获取上传的文件

    // 处理上传的文件
    for (const file of files) {
      const filename = file.filename;
      const targetPath = `${uploadFileAbsolutePath}/${filename}`;

      // 将文件移动到指定位置
      await moveFile(file.filepath, targetPath);
    }

    return true;
  }

  /** 平台上传接口.map 文件接口 */
  public async uploadForPlatform() {
    const { ctx } = this;

    validateToken(ctx.header?.authorization);

    const { appId } = await validateParams(ctx.request.query, UploadForPlatformDTO);
    await ctx.service.application.validateHasApp(appId)

    const { mapFileAbsolutePath } = this.config as any as DefaultConfig;
    const files = ctx.request.files; // 获取上传的文件

    // 处理上传的文件
    for (const file of files) {
      const filename = file.filename;
      const targetPath = `${mapFileAbsolutePath}/${appId}/${filename}`;

      // 将文件移动到指定位置
      await moveFile(file.filepath, targetPath);
    }
    return true
  }

  /** 平台上传接口.map 文件接口 */
  public async uploadForPlugin() {
    const { ctx } = this;
    const { appId, appKey } = await validateParams(ctx.request.query, UploadForPlugin);
    await ctx.service.application.validateAppConfig({ appId, appKey })

    const { mapFileAbsolutePath } = this.config as any as DefaultConfig;
    const files = ctx.request.files; // 获取上传的文件

    // 处理上传的文件
    for (const file of files) {
      const filename = file.filename;
      const targetPath = `${mapFileAbsolutePath}/${appId}/${filename}`;

      // 将文件移动到指定位置
      await moveFile(file.filepath, targetPath);
    }
    return true
  }
}
