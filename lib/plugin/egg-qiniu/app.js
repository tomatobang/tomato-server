'use strict';
const qiniu = require('./lib/qiniu');

module.exports = app => {
  if (app.config.qiniu.ACCESS_KEY) qiniu(app);
};
