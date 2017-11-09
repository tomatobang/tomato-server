'use strict';

module.exports = (app) => {
  return async function (next) {
    onsole.log('auth!');
    await next;
    console.log('disconnect!');
  };
};
