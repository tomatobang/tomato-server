// app.js
module.exports = app => {
    /**
     * 应用启动前初始化工作
     */
    app.beforeStart(async function () {
      app.author = "yipeng.info";
      console.log(app.author);
    });
  };