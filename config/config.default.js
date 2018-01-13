'use strict';
const env = process.env;

exports.keys = 'com.server.tomatobang';
exports.middleware = [ 'ratelimit', 'errorhandler', 'robot', 'jwt' ];

exports.security = {
  csrf: {
    enable: false,
  },
};

exports.logger = {
  level: 'DEBUG',
  consoleLevel: 'INFO',
  // 应用启动后，也能看能日志了( 文档中没说明:不建议使用 )
  disableConsoleAfterReady: false,
};

exports.static = {
  buffer: true,
  maxAge: 31536000,
};

exports.io = {
  namespace: {
    '/tomatobang': {
      connectionMiddleware: [ 'auth' ],
      packetMiddleware: [],
    },
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
};

exports.mongoose = {
  url: 'mongodb://' + (env.DATABASE_HOST ? env.DATABASE_HOST : '127.0.0.1') + ':27017/tomatobang',
  options: {},
};

exports.redis = {
  client: {
    port: env.redisPort || 6379,
    host: env.mongoHost || '127.0.0.1',
    password: env.redisPassword || '',
    db: 0,
  },
};

exports.ratelimit = {
  duration: 60000,
  throw: true,
  errorMessage: '请求频率过快！',
  max: 2000,
};

exports.robot = {
  ua: [
    /Baiduspider/i,
  ],
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

exports.rongyun = {
  rongyun_key: 'lmxuhwagxgt9d',
  rongyun_secret: 'NpbRLWPxB79',
};

exports.admin = {
  defaultAdminName: env.defaultAdminName || 'admin',
  defaultAdminPassword: env.defaultAdminPassword || '123456',
};

exports.serverPort = {
  serverPort: env.serverPort || 3000,
};

exports.cors = {
  origin: '*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  credentials: true,
};

exports.alinode = {
  server: 'wss://agentserver.node.aliyun.com:8080',
  appid: '182',
  secret: '',
  // logdir: '/tmp/',
  // error_log: [
  // '/root/.logs/error.#YYYY#-#MM#-#DD#.log',
  // ]
};

exports.cors = {
  origin: '*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  credentials: true,
};

exports.qiniu = {
  ACCESS_KEY: 'Y44Z8xMcoLUS2fVVQvRJQnWz388t5kjhpqCOaJz8',
  SECRET_KEY: 'm3AnlOvO28Ok25Xg75tvyhNIWW2Ao7Yet7Q8G4sD',
  expires: 7200,
  scope: 'yipeng-images',
};

exports.options = [
  {
    key: 'analyzeCode',
    value: '',
  },
  {
    key: 'description',
    value: '',
  },
  {
    key: 'faviconUrl',
    value: '/static/favicon.ico',
  },
  {
    key: 'logoUrl',
    value: '/static/logo.png',
  },
  {
    key: 'githubUrl',
    value: '',
  },
  {
    key: 'keywords',
    value: '',
    desc: '网站关键字',
  },
  {
    key: 'miitbeian',
    value: '',
  },
  {
    key: 'numPerPage',
    value: '',
  },
  {
    key: 'siteUrl',
    value: '',
  },
  {
    key: 'title',
    value: '',
  },
  {
    key: 'weiboUrl',
    value: '',
  },
  {
    key: 'twoFactorAuth',
    value: '',
  },
];
