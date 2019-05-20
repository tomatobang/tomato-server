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
    asset: { type: ObjectId, ref: 'asset' },
    // 资产余额
    asset_balance: { type: Number, default: 0 },
    // 标签
    tag: { type: String, default: '' },
    // 数目
    amount: { type: Number, default: 0 },
    // 类别 [收入/支出]
    type: { type: String, default: '' },
    // 备注
    note: { type: String, default: '' },
    // 账单发生时间 
    create_at: { type: Date, default: Date.now },
    // 记录时间 
    record_at: { type: Date, default: Date.now },
    // 是否已删除
    deleted: { type: Boolean, default: false },
  });
  return mongoose.model('bill', bill);
};
