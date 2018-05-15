'use strict';
// app/router.js
module.exports = app => {
  const { router, controller } = app;
  // for test
  router.get('/', controller.home.index);

  // socket.io: 番茄钟同步
  app.io
    .of('/tomatobang')
    .route('load_tomato', app.io.controllers.tomatobang.loadTomato);
  app.io
    .of('/tomatobang')
    .route('start_tomato', app.io.controllers.tomatobang.startTomato);
  app.io
    .of('/tomatobang')
    .route('break_tomato', app.io.controllers.tomatobang.breakTomato);

  // socket.io: 聊天同步
  // app.io.of('/chat').route('login', app.io.controllers.chat.login);
  // app.io.of('/chat').route('send_message', app.io.controllers.chat.sendMessage);
  // app.io
  //   .of('/chat')
  //   .route(
  //     'load_online_friend_list',
  //     app.io.controllers.chat.loadOnlineFriendList
  //   );
  // app.io
  //   .of('/chat')
  //   .route('send_friend_request', app.io.controllers.chat.sendFriendRequest);

  // 版本管理
  router.get('/api/version', controller.version.findLatestVersion);
  // 选项
  router.get('/api/option', controller.version.list);

  /**
   * 用户类
   */
  router.get('/api/user', controller.user.list);
  router.get('/api/user/:id', controller.user.findById);
  router.post('/api/user', controller.user.create);
  router.del('/api/user/:id', controller.user.deleteById);
  router.post('/email_username/verify', controller.user.emailUserNameVerify);
  router.post('/api/login', controller.user.login);
  router.post('/api/logout', controller.user.logout);
  router.post('/api/user/headimg', controller.user.updateHeadImg);
  router.post('/api/user/sex', controller.user.updateSex);
  router.post('/api/user/displayname', controller.user.updateDisplayName);
  router.post('/api/user/email', controller.user.updateEmail);
  router.post('/api/user/location', controller.user.updateLocation);
  router.post('/api/user/bio', controller.user.updateBio);
  router.post('/api/user/:id', controller.user.updateById);

  /**
   * 番茄钟类
   */
  router.get('/api/tomato', controller.tomato.list);
  router.get('/api/tomato/:id', controller.tomato.findById);
  router.get('/filter/tomatotoday', controller.tomato.tomatoToday);
  router.post('/api/tomato', controller.tomato.create);
  router.post('/api/search', controller.tomato.search);
  router.post('/api/tomato/statistics', controller.tomato.statistics);
  router.post('/api/tomato/pagination', controller.tomato.pagination);
  router.del('/api/tomato/:id', controller.tomato.deleteById);
  router.post('/api/tomato/:id', controller.tomato.updateById);

  /**
   * 任务类
   */
  router.get('/api/task', controller.task.list);
  router.get('/api/task/:id', controller.task.findById);
  router.post('/api/task', controller.task.create);
  router.del('/api/task/:id', controller.task.deleteById);
  router.post('/api/task/updateVoiceUrl', controller.task.updateVoiceUrl);
  router.post('/api/task/:id', controller.task.updateById);

  /**
   * 配置类
   */
  router.get('/api/options', controller.options.list);

  /**
   * 社交类
   */

  router.post('/api/user_friend', controller.userFriend.getUserFriends);

  router.post(
    '/api/user_friend/request_add_friend',
    controller.userFriend.requestAddFriend
  );
  router.post(
    '/api/user_friend/response_add_friend',
    controller.userFriend.responseAddFriend
  );

  /**
   * 其它
   */
  router.get('/qiu/test', controller.other.test);
  router.get('/qiu/uploadtoken', controller.other.getQiniuUploadToken);
};
