'use strict';
/**
 * verify
 */
import { Context, Application } from 'egg';

export default function jwtMiddleware(option, app: Application) {
  return async (ctx: Context, next) => {
    const apiNoAuth =
      ctx.url.startsWith('/api/login') ||
      ctx.url.endsWith('/api/user') ||
      ctx.url.endsWith('/api/version') ||
      ctx.url.endsWith('qiu/test') ||
      ctx.url.endsWith('/email_username/verify');
    if (apiNoAuth) {
      return next();
    }
    const headers = ctx.request.headers;
    let token;
    try {
      token = headers.authorization;
    } catch (err) {
      ctx.status = 500;
      ctx.message = 'unknown server error';
      return (ctx.body = {
        status: 'fail',
        description: err,
      });
    }

    if (!token) {
      ctx.status = 401;
      ctx.message = 'Token not found';
      return (ctx.body = {
        status: 'fail',
        description: 'Token not found',
      });
    }
    const result = app['util'].jwt.tokenService.verifyToken(token);
    if (result === false) {
      ctx.status = 401;
      ctx.message = 'Token verify failed';
      return (ctx.body = {
        status: 'fail',
        description: 'Token verify failed',
      });
    }

    const reply = await app['redis'].get(token);

    console.log('当前用户:', reply);
    if (reply) {
      // prolong token
      app['redis'].expire(token, 3 * 24 * 60 * 60);
      const currentUser = JSON.parse(reply);
      ctx.request['currentUser'] = currentUser;
      return next();
    }
    ctx.status = 401;
    ctx.message = 'Token invalid';
    return (ctx.body = {
      status: 'fail',
      description: 'Token invalid',
    });
  };
}
