'use strict';
const { createConsul } = require('./app/consul');
const project = require('./app/utils/project');
module.exports = app => {

  const unregister = () => {
    const { name = project.getProjectName() } = app.consul.config;
    app.consul.agent.service.deregister(name);
    app.logger.info('服务关闭解除注册');
  }

  process.once('SIGINT', unregister);
  // kill(3) Ctrl-\
  process.once('SIGQUIT', unregister);
  // kill(15) default
  process.once('SIGTERM', unregister);

  app.beforeStart(async () => {
    app.addSingleton('consul', createConsul);
  });

  // 无法使用
  app.beforeClose(unregister);
};