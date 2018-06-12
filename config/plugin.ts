'use strict';

import { EggPlugin } from 'egg';
const path = require('path')

const plugin: EggPlugin = {
  static: true,
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },

  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },

  redis: {
    enable: true,
    package: 'egg-redis',
  },

  cors: {
    enable: true,
    package: 'egg-cors',
  },

  io: {
    enable: true,
    package: 'egg-socket.io',
  },

  validate: {
    package: 'egg-validate',
  },

  qiniu: {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-qiniu'),
  },

  // alinode : {
  //   enable: true,
  //   package: 'egg-alinode'
  // },
};

export default plugin;
