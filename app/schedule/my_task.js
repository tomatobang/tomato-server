'use strict';

exports.schedule = {
  interval: 30000,
  type: 'all',
};

exports.task = function* (ctx) {
  ctx.logger.info('all&&interval');
};