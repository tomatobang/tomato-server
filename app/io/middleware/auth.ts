'use strict';
import { Application, Context } from 'egg';

module.exports = (app: Application) => {
  return async function(ctx: Context, next) {
    const token = ctx.socket.handshake.query.token;
    const reply = await app['redis'].get(token);
    if (reply) {
      app['redis'].expire(token, 3 * 24 * 60 * 60);
      await next;
    } else {
      ctx.socket.emit('verify_failed', {});
    }
  };
};
