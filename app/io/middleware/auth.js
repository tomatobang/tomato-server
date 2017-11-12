'use strict';

module.exports = (app) => {
  return function* (next) {
    console.log('auth!');
    yield* next;
    console.log('disconnect!');
  };
};
