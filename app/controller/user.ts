import { Controller } from 'egg';
import { validateParams } from '../utils/validator';
import { LoginDTO } from '../dto/login.dto';
import User from '../entities/User';
import { RegisterDTO } from '../dto/register.dto';
import { checkToken } from '../utils/validateToken';
import { CheckTokenDTO } from '../dto/user.dto';

// in controller
export default class UserController extends Controller {

  public async index() {
    const { ctx } = this;

    const errors = await validateParams(ctx.body, LoginDTO);

    const data = await ctx.repo.User.find();

    ctx.body = {
      code: 'ok',
      data,
      errors,
    };
  }

  async login(): Promise<{ token: string }> {
    const { ctx } = this;
    const data = await validateParams(ctx.request.body, LoginDTO);
    return this.service.user.login(data);
  }

  async register(): Promise<User> {
    const { ctx } = this;
    const registerDTO = await validateParams(ctx.request.body, RegisterDTO);
    return await this.service.user.register(registerDTO);
  }

  async checkToken() {
    const { ctx } = this;
    const { token } = await validateParams(ctx.request.body, CheckTokenDTO);
    return checkToken(token);
  }
}
