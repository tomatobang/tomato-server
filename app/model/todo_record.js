'use strict';

module.exports = app => {
  /**
   * TODO 记录
   */
  const mongoose = app.mongoose;
  const ObjectId = mongoose.Schema.ObjectId;

  const todo_record = new mongoose.Schema({
    // 关联 todo
    todo: { type: ObjectId },
    // 备注
    note: String,
    // 完成时间 
    finish_at: type: Date, 
    // 是否已删除
    deleted: { type: Boolean, default: false },
  });
  return mongoose.model('todo_record', todo_record);
};
