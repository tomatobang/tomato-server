'use strict';
import { Context, Application } from 'egg';

export default function errorhandlerMiddleware(option, app: Application) {
  return async function(ctx: Context, next) {
    try {
      await next();
    } catch (err) {
      app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端
      const error =
        status === 500 && app.env === 'prod'
          ? 'Internal Server Error'
          : err.message;
      ctx.body = { error };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
}
