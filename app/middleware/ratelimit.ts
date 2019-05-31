'use strict';

// app/middleware/ratelimit.js
// refer:https://github.com/koajs/ratelimit

import * as koaRatelimit from 'koa-ratelimit';
import { Application, Context } from 'egg';
import { BizConfig } from '../../config/config.default';

export default function ratelimitMiddleware(
  option: BizConfig['ratelimit'],
  app: Application
) {
  return async function(ctx: Context, next) {
    const apiNoAuth =
      ctx.url.startsWith('/api/login') ||
      ctx.url.endsWith('/api/user') ||
      ctx.url.endsWith('/api/version') ||
      ctx.url.endsWith('/email_username/verify');
    if (apiNoAuth) {
      return await koaRatelimit({
        db: app['redis'],
        duration: option.duration,
        errorMessage: option.errorMessage,
        throw: option.throw, // throw error
        id: ctx => ctx.ip,
        headers: {
          remaining: 'Rate-Limit-Remaining',
          reset: 'Rate-Limit-Reset',
          total: 'Rate-Limit-Total',
        },
        max: option.max,
      })(ctx, next);
    }
    return next();
  };
}
