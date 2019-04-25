'use strict';

module.exports = app => {
    /**
     * 动态
    */
    const mongoose = app.mongoose;
    const ObjectId = mongoose.Schema.ObjectId;
    const pub = new mongoose.Schema({
        // 内容
        content: { type: ObjectId },
        // 类型 [足迹/番茄钟/...]
        type: { type: String },
        // 发布用户
        userid: { type: ObjectId, ref: 'user' },
        // 点赞者
        ups: [mongoose.Schema.Types.ObjectId],
        // 是否置顶
        top: { type: Boolean, default: false },
        // 是否禁止回复
        lock: { type: Boolean, default: false },
        // 回复数
        reply_count: { type: Number, default: 0 },
        // 阅读数
        visit_count: { type: Number, default: 0 },
        // 点赞数
        thumb_up_count: { type: Number, default: 0 },
        // 创建时间
        create_at: { type: Date, default: Date.now },
        // 更新时间
        update_at: { type: Date, default: Date.now },
        // 最新回复
        last_reply: { type: ObjectId },
        // 最新回复时间
        last_reply_at: { type: Date, default: Date.now },
        // 是否为富文本
        content_is_html: { type: Boolean },
        // 删除标识
        deleted: { type: Boolean, default: false },
    });

    pub.index({ userid: 1 });

    return mongoose.model('pub', pub);
};
