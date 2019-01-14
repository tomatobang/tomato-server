'use strict';

/**
 * for test
 */
exports.schedule = {
  interval: 3600000,
  type: 'all',
};

exports.task = function* (ctx) {
  ctx.logger.info('all&&interval');

  // refresh qiniu token
  ctx.qiniu.config(ctx.app.config.qiniu);
  console.log(ctx.qiniu.getuploadToken());
};
