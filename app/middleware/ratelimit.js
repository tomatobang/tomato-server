"use strict";
// app/middleware/ratelimit.js
// 参考:https://github.com/koajs/ratelimit
const koaRatelimit = require("koa-ratelimit");

/**
 * 接口请求前验证
 */
module.exports = (option, app) => {
  return async function(ctx, next) {
    let apiNoAuth =
      ctx.url.startsWith("/api/login") ||
      ctx.url.endsWith("/api/user") ||
      ctx.url.endsWith("/api/version") ||
      ctx.url.endsWith("/email_username/verify");
    if (apiNoAuth) {
      await koaRatelimit({
        db: app.redis,
        duration: option.duration,
        errorMessage: option.errorMessage,
        throw: option.throw, // 是否抛出异常
        id: ctx => ctx.ip,
        headers: {
          remaining: "Rate-Limit-Remaining",
          reset: "Rate-Limit-Reset",
          total: "Rate-Limit-Total"
        },
        max: option.max
      })(ctx, next);
      return next();
    } else {
      return next();
    }
  };
};
