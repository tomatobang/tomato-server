'use strict';

module.exports = app => {
  /**
   * TODO 记录
   */
  const mongoose = app.mongoose;
  const ObjectId = mongoose.Schema.ObjectId;

  const todo_record = new mongoose.Schema({
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
    tag: { type: ObjectId, ref: 'tag' },
    // 备注
    notes: { type: String, default: '' },
    // 是否自动添加
    auto_add: { type: Boolean, default: false },
    // 创建时间 
    create_at: { type: Date, default: Date.now },
    // 是否已删除
    deleted: { type: Boolean, default: false },
  });
  return mongoose.model('todo_regular', todo_record);
};
