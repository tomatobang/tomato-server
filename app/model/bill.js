'use strict';

module.exports = app => {
  /**
   * 账单
   */
  const mongoose = app.mongoose;
  const ObjectId = mongoose.Schema.ObjectId;

  const bill = new mongoose.Schema({
    // 用户编号
    userid: { type: ObjectId, ref: 'user' },
    // 关联足迹
    footprint: { type: String, default: '' },
    // 关联资产
    asset: { type: String, default: '' },
    // 标签
    tag: { type: String, default: '' },
    // 数目
    amount: { type: Number, default: 0 },
    // 备注
    note: { type: String, default: '' },
    // 时间 
    create_at: { type: Date, default: Date.now },
    // 是否已删除
    deleted: { type: Boolean, default: false },
  });
  return mongoose.model('bill', bill);
};
