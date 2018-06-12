'use strict';

import { BizConfig } from '../../config/config.default';
import { Context } from 'egg';
export default function robotMiddleware(options: BizConfig['robot']) {
  return async function(ctx: Context, next) {
    const source = ctx.get('user-agent') || '';
    const match = options.ua.some(ua => ua.test(source));
    if (match) {
      ctx.status = 403;
      ctx.body = {
        message: 'Go away, robot.',
      };
    } else {
      await next();
    }
  };
}
