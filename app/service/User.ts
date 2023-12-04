import { Service } from 'egg';
import { RegisterDTO } from '../dto/register.dto';
import { HttpException, HttpStatus } from '../errors';
import { encryptPassword, makeSalt } from '../utils/password';
import User from '../entities/User';
import { LoginDTO } from '../dto/login.dto';
import { DefaultConfig } from '../../config/config.default';
import { generateToken } from '../utils/generateToken';
import { TokenIncludeInfo } from '../dto/tokenIncludeInfo.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from '../dto/pagination.dto';
import { getUserPermission } from '../utils/getUserPermissions';

/**
 * HackerNews Api Service
 */
export class UserService extends Service {
  // 校验注册信息
  async checkRegisterForm(registerDTO: RegisterDTO): Promise<any> {
    const { account } = registerDTO;
    const { ctx } = this;
    const hasUser = await ctx.repo.User.findOne({ where: { account } });

    if (hasUser) {
      throw new HttpException(
        { message: 'account重复，账号已存在', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }
  }

  // 注册
  async register(registerDTO: RegisterDTO): Promise<any> {
    await this.checkRegisterForm(registerDTO);
    const { repo } = this.ctx;
    const { nickname, password, account } = registerDTO;
    const salt = makeSalt(); // 制作密码盐
    const hashPassword = encryptPassword(password, salt); // 加密密码

    const newUser: User = new User();
    newUser.nickname = nickname;
    newUser.account = account;
    newUser.password = hashPassword;
    newUser.salt = salt;
    return await repo.User.save(newUser);
  }

  // 登陆校验用户信息
  async checkLoginForm(loginDTO: LoginDTO): Promise<User> {
    const { account, password } = loginDTO;
    const { repo } = this.ctx;
    const user = await repo.User
      .createQueryBuilder('user')
      .addSelect('user.salt')
      .addSelect('user.password')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .leftJoinAndSelect('permissions.application', 'application')
      .where('user.account = :account', { account })
      .getOne();

    if (!user) {
      throw new HttpException(
        { message: '用户不存在', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }

    this.checkPassWord(user, password);

    return user;
  }

  checkPassWord(user: User, currentPassword: string) {
    const { password: dbPassword, salt } = user;
    const currentHashPassword = encryptPassword(currentPassword, salt);
    if (currentHashPassword !== dbPassword) {
      throw new HttpException(
        { message: '密码错误', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }
  }

  // 生成 token
  async certificate(user: User, permission: any) {
    const { jwt } = this.config as any as DefaultConfig;

    const payload: TokenIncludeInfo = {
      id: user.id,
      nickname: user.nickname,
      account: user.account,
      permission,
    };

    return generateToken(jwt, payload);
  }

  async login(loginDTO: LoginDTO): Promise<{ token: string }> {
    const user = await this.checkLoginForm(loginDTO);

    const permission = getUserPermission(user.permissions);

    const token = await this.certificate(user, permission);
    return { token };
  }

  // 获取用户列表
  async getUserList(paginationDto: PaginationDto) {
    const { ctx } = this;
    const { pageSize, current } = paginationDto;

    const [ userList, total ] = await ctx.repo.User.findAndCount({
      take: pageSize,
      skip: pageSize * (current - 1),
    });
    return { userList, total };
  }

  // 更新用户信息
  async updateUser(id: User['id'], updateUserDto: UpdateUserDto) {
    const { ctx } = this;
    const currentUser = await ctx.repo.User
      .createQueryBuilder('user')
      .addSelect('user.salt')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();

    if (!currentUser) return;
    const { password } = updateUserDto;
    this.checkPassWord(currentUser, password);

    if (currentUser) {
      const user = plainToInstance(User, updateUserDto);
      await ctx.repo.User.update(id, user);
      return await ctx.repo.User.findOne({ where: { id } });
    }
  }

  async getUserPermission(id: User['id']) {
    const { User } = this.ctx.repo;

    const user = await User
      .createQueryBuilder('user')
      .addSelect('user.salt')
      .addSelect('user.password')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .leftJoinAndSelect('permissions.application', 'application')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new HttpException(
        { message: '用户不存在', code: HttpStatus.BAD_REQUEST },
        HttpStatus.OK,
      );
    }

    return getUserPermission(user.permissions);
  }
}

export default UserService;
