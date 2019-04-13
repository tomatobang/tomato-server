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

  config.consul = {
    client: {
      host: {
         // register center ip , default 127.0.0.1
        ip: '120.78.70.176',
        // register center port, default 8500
        port: '8500', 
        // optional
        defaults: { 
          // token: 'acl token'
        }
      },
      server: {
        name: 'tomato-server', // project name, default project name
        // service ip, default extranet ip
        // address: '', 
        // service port, default service port
        // port: '', 
        check: {
          path: '/api/ping' // health check http path
        },
        tags: ['tomato'] // service tags
      }
    }
  };

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
    // 应用启动后，也能看日志( 文档中没说明, 且不建议使用 )
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
    url: 'mongodb://127.0.0.1:27017/tomatobang',
    options: {},
  };
  // 另一种可行的配置方式
  // config.mongoose = {
  //   url: 'mongodb://your_host:your_port/db',
  //   options: {
  //     auth: { authSource: "username" },
  //     user: 'username',
  //     pass: 'pass'
  //   }
  // };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  config.ratelimit = {
    duration: 60000,
    throw: true,
    errorMessage: 'request too fast！',
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
    appid: 'YOUR_APP_ID',
    secret: 'YOUR_APP_SECRET',
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };

  config.qiniu = {
    ACCESS_KEY: env.QINIU_DEV_ACCESS_KEY,
    SECRET_KEY: env.QINIU_DEV_SECRET_KEY,
    expires: 7200,
    scope: 'tomatobang',
    insertOnly: 0,
  };

  return config;
};
