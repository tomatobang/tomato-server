// app.js
module.exports = app => {
    /**
     * 应用启动前初始化工作
     */
    app.beforeStart(async function () {
      app.tips = "tomatobang start...";
      console.log(app.tips);
    });
  };