import { Context } from 'egg';
import { HttpException, HttpStatus } from '../errors';

export default function responseHandler() {
  return async (ctx: Context, next: () => Promise<any>) => {

    try {
      const res = await next();
      const body = res !== undefined && res !== null ? res : ctx.body;

      // 统一处理响应
      if (body !== undefined && body !== null) {
        ctx.body = {
          code: HttpStatus.OK,
          message: 'success',
          data: body,
        };
      }

    } catch (error: any) {

      if (error instanceof HttpException) {
        // 处理错误
        ctx.status = error.status || 500; // 设置响应状态码，默认为 500
        ctx.body = {
          code: error.code,
          message: error.message || 'Internal Server Error',
        }; // 设置响应体

      } else {

        // 记录错误日志
        ctx.logger.error(error);
      }
    }
  };
}

