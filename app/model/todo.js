'use strict';

module.exports = app => {
  /**
   * TODO
   */
  const mongoose = app.mongoose;
  const ObjectId = mongoose.Schema.ObjectId;

  const todo = new mongoose.Schema({
    // 用户编号
    userid: { type: ObjectId, ref: 'user' },
    // 主题
    title: { type: String, default: '' },
    /**
     * 类型
     * 1:日、2:周、3:月、4:年 
     * */
    type: { type: Number, default: 1 },
    // 标签
    // tag: { type: ObjectId, ref: 'tag', default: null },
    // 备注
    notes: { type: String, default: '' },
    // 时间 
    create_at: { type: Date, default: Date.now },
    // 是否已完成
    completed: { type: Boolean, default: false },
    // 完成时间 
    finish_at: { type: Date, default: '' },
    // 是否已删除
    deleted: { type: Boolean, default: false },
  });

  return mongoose.model('todo', todo);
};
