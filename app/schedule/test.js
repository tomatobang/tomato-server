'use strict';

/**
 * for test
 */
exports.schedule = {
  interval: 30000000,
  type: 'all',
};

exports.task = function* (ctx) {
  ctx.logger.info('all&&interval');
};
