'use strict';

module.exports = app => {
  /**
   * 足迹
   */
  const mongoose = app.mongoose;
  const ObjectId = mongoose.Schema.ObjectId;

  const footprint = new mongoose.Schema({
    // 标签
    tag: { type: ObjectId },
    // 关联支付记录
    bill: { type: ObjectId },
    // 心情 (1-5)
    mode: { type: Number, default: 3 },
    // 位置
    position:{ type: String, default: '' },
    // 备注
    note: String,
    // 时间 
    create_at: { type: Date, default: Date.now },
    // 是否已删除
    deleted: { type: Boolean, default: false },
  });
  return mongoose.model('footprint', footprint);
};
