'use strict';
const env = process.env

exports.keys = "此处改为你自己的 Cookie 安全字符串";

exports.security = {
  csrf: {
    // 不借助 egg 实现
    enable: false 
  }
};

// 日志分为 NONE，DEBUG，INFO，WARN 和 ERROR 5 个级别。
exports.logger = {
  level: 'DEBUG',
  consoleLevel: 'INFO'
};

// 默认配置如下
// prefix: /public/
// dir: path.join(appInfo.baseDir, 'app/public')
// dynamic: true
// preload: false
// maxAge: 31536000 in prod env, 0 in other envs
// buffer: true in prod env, false in other envs
exports.static = {
  // maxAge: 31536000,
};


exports.io = {
  namespace: {
    '/tomatobang': {
      connectionMiddleware: ['auth'],
      packetMiddleware: [],
    }
  },
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
};
exports.keys = 'com.server.tomatobang';


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


exports.middleware = ['ratelimit','errorhandler','robot','jwt'];
exports.ratelimit= {
  duration: 60000,
  throw:true,
  errorMessage: "请求频率过快！",
  max: 2,
},
// robot's configurations
exports.robot = {
  ua: [
    /Baiduspider/i,
  ]
};

// 添加 view 配置
exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
};


// 添加 token 配置
exports.token = {
  tokenSecret: env.tokenSecret || 'test',
  tokenExpiresIn: env.tokenExpiresIn || '3d'
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
  credentials: true
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
