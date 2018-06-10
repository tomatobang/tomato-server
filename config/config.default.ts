'use strict';

import { EggAppConfig, PowerPartial } from 'egg';
const env = process.env;

// 提供给 config.{env}.ts 使用
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// 应用本身的配置 Scheme
export interface BizConfig {
  ratelimit: {
    duration: number;
    throw: boolean;
    errorMessage: string;
    max: number;
  };

  robot: {
    ua: any;
  };
}
// appInfo: EggAppInfo
export default () => {
  const config = {} as PowerPartial<EggAppConfig> & BizConfig;

  config.cluster = {
    listen: {
      port: 7001,
    },
  };

  config.keys = 'com.server.tomatobang';
  config.middleware = ['ratelimit', 'errorhandler', 'robot', 'jwt'];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'INFO',
    dir: '../app',
    encoding: 'utf-8',
    // 应用启动后，也能看日志( 文档中没说明:不建议使用 )
    // disableConsoleAfterReady: false,
  };

  config.static = {
    dir: '../app/public',
    prefix: '',
    buffer: true,
    maxAge: 31536000,
    dynamic: false,
    preload: false,
    maxFiles: 20,
  };

  config.io = {
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

  config.mongoose = {
    url:
      'mongodb://' +
      (env.DATABASE_HOST ? env.DATABASE_HOST : '127.0.0.1') +
      ':27017/tomatobang',
    options: {},
  };
  // 另一种可行的配置方式
  // config.mongoose = {
  //   url: 'mongodb://localhost/db',
  //   options: {
  //     auth: { authSource: "username" },
  //     user: 'username',
  //     pass: 'pass'
  //   }
  // };

  config.redis = {
    client: {
      port: env.redisPort || 6379,
      host: env.mongoHost || '127.0.0.1',
      password: env.redisPassword || '',
      db: 0,
    },
  };

  config.ratelimit = {
    duration: 60000,
    throw: true,
    errorMessage: '请求频率过快！',
    max: 2000,
  };

  config.robot = {
    ua: [/Baiduspider/i],
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  config.token = {
    tokenSecret: env.tokenSecret || 'test',
    tokenExpiresIn: env.tokenExpiresIn || '3d',
  };

  config.rongyun = {
    rongyun_key: 'lmxuhwagxgt9d',
    rongyun_secret: 'NpbRLWPxB79',
  };

  config.admin = {
    defaultAdminName: env.defaultAdminName || 'admin',
    defaultAdminPassword: env.defaultAdminPassword || '123456',
  };

  config.serverPort = {
    serverPort: env.serverPort || 3000,
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };

  config.alinode = {
    server: 'wss://agentserver.node.aliyun.com:8080',
    appid: '182',
    secret: '',
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };

  config.qiniu = {
    ACCESS_KEY: 'Y44Z8xMcoLUS2fVVQvRJQnWz388t5kjhpqCOaJz8',
    SECRET_KEY: 'm3AnlOvO28Ok25Xg75tvyhNIWW2Ao7Yet7Q8G4sD',
    expires: 7200,
    scope: 'yipeng-images',
    insertOnly: 0,
  };

  return config;
};
