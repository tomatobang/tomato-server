'use strict';

module.exports = app => {
  /**
   * 好友关系
   * TODO:
   *  + 好友上限值设置
   *  + 活跃好友
   */
  const mongoose = app.mongoose;
  const ObjectId = mongoose.Schema.ObjectId;
  const user_friend = new mongoose.Schema({
    // 用户编号( 发起者 )
    from: { type: ObjectId, ref: 'user' },
    // 用户编号( 接受者 )
    to: { type: ObjectId, ref: 'user' },
    // 请求时间
    request_time: { type: Date },
    // 回复时间
    response_time: { type: Date },
    // 状态:1(发起请求待回复)、2(回复且同意)、3(回复且拒绝)、4(忽略)
    state: { type: Number },
    // 请求好友时发送消息
    info: String,
    // 权限
    permission_level: { type: Number, default: 1 },
    // 是否已删除
    deleted: { type: Boolean, default: false },
  });

  user_friend.index({ from: 1, to: 1 }, { unique: true });
  return mongoose.model('user_friend', user_friend);
};
