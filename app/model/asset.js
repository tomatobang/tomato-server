'use strict';

module.exports = app => {
    /**
     * 资产
     */
    const mongoose = app.mongoose;
    const ObjectId = mongoose.Schema.ObjectId;

    const asset = new mongoose.Schema({
        // 用户编号
        userid: { type: ObjectId, ref: 'user' },
        // 名称
        name: { type: String, default: '' },
        // 数目
        amount: { type: Number, default: 0 },
        // 备注
        note: { type: String, default: '' },
        // 时间 
        create_at: { type: Date, default: Date.now },
        // 是否已删除
        deleted: { type: Boolean, default: false },
    });
    return mongoose.model('asset', asset);
};
