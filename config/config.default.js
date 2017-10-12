'use strict';

exports.keys = "此处改为你自己的 Cookie 安全字符串";

exports.mongoose = {
  url: 'mongodb://127.0.0.1:27017/blog',
  options: {}
};

config.redis = {
  client: {
    port: env.redisPort || 6379,
    host: env.mongoHost || '127.0.0.1',
    password: env.redisPassword || '',
    db: 0,
  }
}

// 添加 view 配置
exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
};

// 添加 news 的配置项
exports.news = {
  pageSize: 5,
  serverUrl: 'http://countdown.yipeng.info/countdown/all',
};

const env = process.env

exports.dataconfig = {
  serverPort: env.serverPort || 3000,

  mongoHost: env.mongoHost || '127.0.0.1',
  mongoDatabase: env.mongoDatabase || 'blog',
  mongoPort: env.mongoPort || 27017,


  tokenSecret: env.tokenSecret || 'test',
  tokenExpiresIn: env.tokenExpiresIn || '7d',

  defaultAdminName: env.defaultAdminName || 'admin',
  defaultAdminPassword: env.defaultAdminPassword || '123456',

  rongyun_key: 'lmxuhwagxgt9d',
  rongyun_secret: 'NpbRLWPxB79',
}
