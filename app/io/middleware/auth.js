'use strict';

module.exports = app => {
  return async function(ctx, next) {
    console.log('auth! todo~~~');
    await next;
    console.log('disconnect!');
    const socket = ctx.socket;
    app.redis.get(socket.id).then(userid => {
      console.log('userid!', userid);
      if (userid) {
        app.redis.srem(userid + ':socket', socket.id).then(() => { });
        app.redis.del(socket.id).then(() => { });
      }
    });
  };
};
