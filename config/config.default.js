'use strict';

exports.keys = "此处改为你自己的 Cookie 安全字符串";

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