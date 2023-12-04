import { Controller } from 'egg';
import { validateParams } from '../utils/validator';
import { GetLogsDTO, LogsDTO } from '../dto/logs.dto';
import { validateToken } from '../utils/validateToken';
import { json } from 'co-body';

export default class NewsController extends Controller {
  public async index() {
    const { ctx, service } = this;
    const body = Object.keys(ctx.request.body).length ? ctx.request.body : await json(ctx.req)

    const { appId, appKey, data } = await validateParams(body, LogsDTO);
    await ctx.service.application.validateAppConfig({ appId, appKey });
    return await service.logs.save(data);
  }

  public async getLogList() {
    const { service, ctx } = this;
    validateToken(ctx.header?.authorization);
    const getLogsParams = await validateParams(ctx.request.query, GetLogsDTO);
    return await service.logs.getLogList(getLogsParams);
  }
}

