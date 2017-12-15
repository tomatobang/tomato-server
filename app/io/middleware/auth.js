'use strict';

module.exports = app => {
  return function* (next) {
    console.log('auth! todo~~~');
    yield* next;
    console.log('disconnect!');
    const socket = this.socket;
    app.redis.get(socket.id).then(userid => {
      console.log('userid!', userid);
      if (userid) {
        app.redis.srem(userid + ':socket', socket.id).then(() => { });
        app.redis.del(socket.id).then(() => { });
      }
    });
  };
};
