'use strict';
const env = process.env

exports.keys = "此处改为你自己的 Cookie 安全字符串";

exports.security={
  csrf: {
    enable: false // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
  }
};

exports.mongoose = {
  url: 'mongodb://127.0.0.1:27017/blog',
  options: {}
};

exports.redis = {
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

// 添加 token 配置
exports.token = {
  tokenSecret: env.tokenSecret || 'test',
  tokenExpiresIn: env.tokenExpiresIn || '7d'
};


// 添加 融云 配置
exports.rongyun = {
  rongyun_key: 'lmxuhwagxgt9d',
  rongyun_secret: 'NpbRLWPxB79'
};

exports.admin = {
  defaultAdminName: env.defaultAdminName || 'admin',
  defaultAdminPassword: env.defaultAdminPassword || '123456',
}

exports.serverPort = {
  serverPort: env.serverPort || 3000
}
exports.cors = {
  origin: '*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  credentials:true
};

exports.options = [
  {
    'key': 'analyzeCode',
    'value': ''
  },
  {
    'key': 'commentType',
    'value': 'disqus'
  },
  {
    'key': 'commentName',
    'value': ''
  },
  {
    'key': 'description',
    'value': ''
  },
  {
    'key': 'faviconUrl',
    'value': '/static/favicon.ico'
  },
  {
    'key': 'logoUrl',
    'value': '/static/logo.png'
  },
  {
    'key': 'githubUrl',
    'value': ''
  },
  {
    'key': 'keywords',
    'value': '',
    'desc': '网站关键字'
  },
  {
    'key': 'miitbeian',
    'value': ''
  },
  {
    'key': 'numPerPage',
    'value': ''
  },
  {
    'key': 'siteUrl',
    'value': ''
  },
  {
    'key': 'title',
    'value': ''
  },
  {
    'key': 'weiboUrl',
    'value': ''
  },
  {
    'key': 'twoFactorAuth',
    'value': ''
  }
]
