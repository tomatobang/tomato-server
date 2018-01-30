'use strict';
const qiniu = require('./lib/qiniu');

module.exports = app => {
  qiniu(app);
};
