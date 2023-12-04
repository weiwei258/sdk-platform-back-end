import { Controller } from 'egg';
import { validateToken } from '../utils/validateToken';
import { validateParams } from '../utils/validator';
import { AppConfig, AppInfoConfig, DeleteApplication } from '../dto/application.dto';
import { CreateApplication } from '../dto/application.dto';

export default class UserController extends Controller {

  async create() {
    const { ctx } = this;
    const userData = validateToken(ctx.header?.authorization);
    const createApplicationData = await validateParams(ctx.request.body, CreateApplication);
    return ctx.service.application.create(createApplicationData, userData);
  }

  async delete() {
    const { ctx } = this;
    const userData = validateToken(ctx.header?.authorization);
    const { appId } = await validateParams(ctx.request.body, DeleteApplication);
    return ctx.service.application.deleteApplication(appId, userData);
  }

  async validateAppConfig() {
    const { ctx } = this;
    const data = await validateParams(ctx.request.body, AppConfig);
    return ctx.service.application.validateAppConfig(data);
  }

  async getAppInfo() {
    const { ctx } = this;
    const userData = validateToken(ctx.header?.authorization);
    const { appId } = await validateParams(ctx.request.query, AppInfoConfig);
    return ctx.service.application.getAppInfo(userData.id, appId);
  }

  async getAppList() {
    const { ctx } = this;
    const userData = validateToken(ctx.header?.authorization);
    return ctx.service.application.getAppList(userData.id);
  }
}
