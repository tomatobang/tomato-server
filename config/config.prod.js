'use strict';
const env = process.env;

exports.keys = 'com.server.tomatobang';
exports.middleware = ['ratelimit', 'errorhandler', 'robot', 'jwt'];

exports.security = {
  csrf: {
    enable: false,
  },
};

exports.logger = {
  level: 'DEBUG',
  consoleLevel: 'INFO',
};

exports.static = {
  buffer: true,
  maxAge: 31536000,
};

exports.io = {
  namespace: {
    '/tomatobang': {
      connectionMiddleware: ['auth'],
      packetMiddleware: [],
    },
    '/chat': {
      connectionMiddleware: [],
      packetMiddleware: [],
    },
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
};

exports.mongoose = {
  url: 'mongodb://' + env.DATABASE_MONGODB_USERNAME_PASSWORD + '@' + env.DATABASE_MONGODB_HOST_PORT + '/tomatobang',
  options: {},
};

exports.redis = {
  client: {
    port: env.REDIS_PORT || 6379,
    host: env.REDIS_HOST || '127.0.0.1',
    password: env.REDIS_PASSWORD || '',
    db: 0,
  },
};

exports.ratelimit = {
  duration: 60000,
  throw: true,
  errorMessage: '请求频率过快！',
  max: 2000,
};

exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
};

exports.token = {
  tokenSecret: env.tokenSecret || 'test',
  tokenExpiresIn: env.tokenExpiresIn || '3d',
};

exports.admin = {
  defaultAdminName: env.defaultAdminName || 'admin',
  defaultAdminPassword: env.defaultAdminPassword || '123456',
};

exports.serverPort = {
  serverPort: env.serverPort || 3000,
};

exports.alinode = {
  server: 'wss://agentserver.node.aliyun.com:8080',
  appid: '',
  secret: '',
  logdir: '/tmp/',
  error_log: ['/root/.logs/error.#YYYY#-#MM#-#DD#.log'],
};

exports.qiniu = {
  ACCESS_KEY:env.QINIU_PROD_SECRET_KEY,
  SECRET_KEY: env.QINIU_PROD_SECRET_KEY,
  expires: 7200,
  scope: 'tomatobang',
};
