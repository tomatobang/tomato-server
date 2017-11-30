// app/router.js
module.exports = app => {
    // for test
    app.get('/', app.controller.home.index);

    // socket.io 相关
    app.io.of('/tomatobang').route('load_tomato', app.io.controllers.tomatobang.loadTomato);
    app.io.of('/tomatobang').route('start_tomato', app.io.controllers.tomatobang.startTomato);
    app.io.of('/tomatobang').route('break_tomato', app.io.controllers.tomatobang.breakTomato);
    app.io.of('/tomatobang').route('disconnect', app.io.controllers.tomatobang.disconnect);

    // 版本管理
    app.get('/api/version', app.controller.version.findLatestVersion);
    
    /**
     * 用户类
     */
    app.get('/api/user', app.controller.user.list);
    app.get('/api/user/:id', app.controller.user.findById);
    app.get('/api/user/headimg/:path', app.controller.user.downloadHeadImg);
    app.post('/api/user', app.controller.user.create);
    app.post('/api/user/:id', app.controller.user.updateById);
    app.del('/api/user/:id', app.controller.user.deleteById);
    //app.post('/getRongyunToken', app.controller.user.getRongyunToken);
    app.post('/email_username/verify', app.controller.user.emailUserNameVerify);
    app.post('/api/login', app.controller.user.login);
    app.post('/api/logout', app.controller.user.logout);
    app.post('/api/user/headimg', app.controller.user.uploadHeadImg);
    app.post('/api/user/sex', app.controller.user.UpdateSex);
    app.post('/api/user/displayname', app.controller.user.UpdateDisplayName);
    app.post('/api/user/email', app.controller.user.UpdateEmail);
    app.post('/api/user/location', app.controller.user.UpdateLocation);
   
    /**
     * 番茄钟类
     */
    app.get('/api/tomato', app.controller.tomato.list);
    app.get('/api/tomato/:id', app.controller.tomato.findById);
    app.get('/filter/tomatotoday', app.controller.tomato.tomatoToday);
    app.post('/api/tomato', app.controller.tomato.create);
    app.post('/api/tomato/:id', app.controller.tomato.updateById);
    app.post('/api/search', app.controller.tomato.search);
    app.post('/api/tomato/statistics', app.controller.tomato.statistics);
    app.del('/api/tomato/:id', app.controller.tomato.deleteById);
   
    /**
     * 任务类
     */
    app.get('/api/task', app.controller.task.list);
    app.get('/api/task/:id', app.controller.task.findById);
    app.post('/api/task', app.controller.task.create);
    app.post('/api/task/:id', app.controller.task.updateById);
    app.del('/api/task/:id', app.controller.task.deleteById);

    /**
     * 配置类
     */
    app.get('/api/options', app.controller.options.list);

    /**
     * 其它
     */
    app.get('/download/voicefile/:path', app.controller.other.downloadVoiceFile);
    app.post('/tool/dismissgroup', app.controller.other.dismissgroup);
    app.post('/upload/voicefile', app.controller.other.uploadVoiceFile);
    
  };