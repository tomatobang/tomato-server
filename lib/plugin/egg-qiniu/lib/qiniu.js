/**
 * Created by jks on 2017/4/3.
 */
'use strict';

const assert = require('assert');
const qiniu = require('./qiniu-wrap');

module.exports = app => {
  // app.addSingleton('qiniu', createQiniu);
  app.qiniu = createQiniu(app.config.qiniu, app);
};

function createQiniu(config, app) {
  assert(config.ACCESS_KEY, '[egg-qiniu] ak is required on config');
  app.coreLogger.info('[egg-qiniu] init %s', config.ACCESS_KEY);
  qiniu.config(config);
  return qiniu;
}
