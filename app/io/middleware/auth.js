'use strict';

module.exports = (app) => {
  return async function (next) {
    this.socket.emit('res', 'auth!');
    await next;
    console.log('disconnect!');
  };
};
