'use strict';
/**
 * TODO: 增加 AUTH 逻辑
 */
import { Application, Context } from 'egg';

module.exports = (app: Application) => {
  return async function(ctx: Context, next) {
    ctx.logger.info('auth!');
    await next;
    ctx.logger.info('disconnect!');
  };
};
