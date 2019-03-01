'use strict';

module.exports = app => {
  /**
   * TODO
   */
  const mongoose = app.mongoose;
  const ObjectId = mongoose.Schema.ObjectId;

  const todo = new mongoose.Schema({
    // 主题
    title: String,
    /**
     * 类型
     * 1:日、2:周、3:月、4:年 
     * */ 
    type: Number;
    // 标签
    tag: { type: ObjectId },
    // 备注
    notes: { type: String, default: '' },
    // 是否重复
    isRepeat: { type: Boolean, default: false },
    // 时间 
    create_at: { type: Date, default: Date.now },
    // 是否已删除
    deleted: { type: Boolean, default: false },
  });

  return mongoose.model('todo', todo);
};
