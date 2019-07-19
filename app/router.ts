'use strict';
import { Application } from 'egg';
// app/router.js
export default (app: Application) => {
  const { router, controller } = app;
  // for test
  router.get('/', controller.home.index);
  router.get('/api/ping', controller.home.index);
  /** TEST: unregister consul */
  // router.get('/api/unregister', controller.home.unregister);

  // socket.io: 番茄钟同步
  app.io
    .of('/tomatobang')
    .route('load_tomato', app.io.controller.tomatobang.loadTomato);
  app.io
    .of('/tomatobang')
    .route('start_tomato', app.io.controller.tomatobang.startTomato);
  app.io
    .of('/tomatobang')
    .route('break_tomato', app.io.controller.tomatobang.breakTomato);
  app.io
    .of('/tomatobang')
    .route('disconnect', app.io.controller.tomatobang.disconnect);
  app.io.of('/tomatobang').route('logout', app.io.controller.tomatobang.logout);

  // socket.io: 聊天同步
  app.io.of('/chat').route('login', app.io.controller.chat.login);
  app.io.of('/chat').route('logout', app.io.controller.chat.logout);

  app.io.of('/chat').route('send_message', app.io.controller.chat.sendMessage);
  app.io
    .of('/chat')
    .route(
      'load_online_friend_list',
      app.io.controller.chat.loadOnlineFriendList
    );
  app.io
    .of('/chat')
    .route('request_add_request', app.io.controller.chat.requestAddFriend);
  app.io
    .of('/chat')
    .route('response_friend_request', app.io.controller.chat.responseAddFriend);
  app.io.of('/chat').route('disconnect', app.io.controller.chat.disconnect);

  // 版本管理
  router.get('/api/version', controller.version.findLatestVersion);
  // 选项
  router.get('/api/option', controller.version.list);

  /**
   * 用户类
   */
  router.get('/api/user', controller.user.list);
  router.get('/api/user/auth', controller.user.auth);
  router.get('/api/user/searchUsers', controller.user.searchUsers);
  router.get('/api/user/:id', controller.user.findById);
  router.post('/api/user/changepwd', controller.user.changePWD);
  router.post('/api/user', controller.user.create);
  router.del('/api/user/:id', controller.user.deleteById);
  router.post('/email_username/verify', controller.user.emailUserNameVerify);
  router.post('/api/login', controller.user.login);
  router.get('/api/logout', controller.user.logout);
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
   * 足迹
   */
  router.get('/api/footprint', controller.footprint.list);
  router.post('/api/footprint/statistics', controller.footprint.statistics);
  router.get('/api/footprint/:id', controller.footprint.findById);
  router.post('/api/footprint', controller.footprint.create);
  router.del('/api/footprint/:id', controller.footprint.deleteById);
  router.post('/api/footprint/:id', controller.footprint.updateById);

  /**
   * TODORegular
   */
  router.get('/api/todoregular', controller.todoRegular.list);
  router.get('/api/todoregular/:id', controller.todoRegular.findById);
  router.post('/api/todoregular', controller.todoRegular.create);
  router.del('/api/todoregular/:id', controller.todoRegular.deleteById);
  router.post('/api/todoregular/:id', controller.todoRegular.updateById);

  /**
   * TODO
   */
  router.get('/api/todo', controller.todo.list);
  router.post('/api/todo/statistics', controller.todo.statistics);
  router.get('/api/todo/:id', controller.todo.findById);
  router.post('/api/todo', controller.todo.create);
  router.post('/api/todo/toggleall', controller.todo.toggleAllTodo);
  router.post('/api/todo/deletecomplete', controller.todo.deleteAllCompletedTodo);
  router.post('/api/todo', controller.todo.create);
  router.del('/api/todo/:id', controller.todo.deleteById);
  router.post('/api/todo/:id', controller.todo.updateById);

  /**
  * 账单
  */
  router.get('/api/bill', controller.bill.list);
  router.post('/api/assetbill', controller.bill.listBillByAsset);
  router.post('/api/bill/statistics', controller.bill.statistics);
  router.post('/api/bill/billexchange', controller.bill.billExchange);
  router.get('/api/bill/:id', controller.bill.findById);
  router.post('/api/bill', controller.bill.create);
  router.del('/api/bill/:id', controller.bill.deleteById);
  router.post('/api/bill/:id', controller.bill.updateById);
  

  /**
  * 资产
  */
  router.get('/api/asset', controller.asset.list);
  router.get('/api/asset/:id', controller.asset.findById);
  router.post('/api/asset', controller.asset.create);
  router.del('/api/asset/:id', controller.asset.deleteById);
  router.post('/api/asset/:id', controller.asset.updateById);

  /**
  * 标签
  */
  router.get('/api/tag', controller.tag.list);
  router.get('/api/tag/:id', controller.tag.findById);
  router.post('/api/tag', controller.tag.create);
  router.del('/api/tag/:id', controller.tag.deleteById);
  router.post('/api/tag/:id', controller.tag.updateById);


  /**
   * 配置类
   */
  router.get('/api/options', controller.options.list);

  /**
   * 社交类
   */
  router.get('/api/user_friend', controller.userFriend.getUserFriends);

  router.post(
    '/api/user_friend/request_add_friend',
    controller.userFriend.requestAddFriend
  );
  router.post(
    '/api/user_friend/response_add_friend',
    controller.userFriend.responseAddFriend
  );

  /**
   * 消息类
   */
  router.post(
    '/api/message/updateReadState',
    controller.message.updateMessageState
  );
  router.get('/api/message', controller.message.loadUnreadMessages);
  router.post('/api/loadHistoryMsg', controller.message.loadHistoryMsg);

  /**
   * 其它
   */
  router.get('/qiu/test', controller.other.test);
  router.get('/qiu/uploadtoken', controller.other.getQiniuUploadToken);
};
