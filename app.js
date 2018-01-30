'use strict';

const path = require('path');
// app.js
module.exports = app => {
  /**
   * 应用启动前初始化工作
   */
  app.beforeStart(async () => {
    app.tips = 'tomatobang start...';
    console.log(app.tips);

    // 删除 socket 所有连接;处理未完成的番茄钟( TODO )
  });

  // true: 可以直接在页面引用 /socket.io/socket.io.js
  app.io.serveClient(false);

  const directory = path.join(app.config.baseDir, 'app/util');
  app.loader.loadToApp(directory, 'util');
};
