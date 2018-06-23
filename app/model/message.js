'use strict';

module.exports = app => {
  /**
   * 消息
   */
  const mongoose = app.mongoose;
  const ObjectId = mongoose.Schema.ObjectId;

  const message = new mongoose.Schema({
    // 消息类型[好友:1、系统:2、其它:3...]
    type: Number,
    // 发起者
    from: { type: ObjectId },
    // 接收人
    to: { type: ObjectId },
    // 消息
    content: String,
    // 创建时间
    create_at: { type: Date, default: Date.now },
    // 是否已读
    has_read: { type: Boolean, default: false },
    // 是否已删除
    deleted: { type: Boolean, default: false },
  });
  message.index({ from: 1, to: 1 });
  return mongoose.model('message', message);
};
