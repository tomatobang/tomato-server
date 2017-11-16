// app.js
module.exports = app => {
    /**
     * 应用启动前初始化工作
     */
    app.beforeStart(async function () {
      app.tips = "tomatobang start...";
      console.log(app.tips);
      // 删除 socket 所有连接
      // 处理未完成的番茄钟
    });
  };