/*
 * @Author: kobepeng 
 * @Date: 2017-12-06 09:21:23 
 * @Last Modified by: kobepeng
 * @Last Modified time: 2017-12-06 10:48:14
 */
module.exports = app => {
    /**
     * 消息
    */
    const mongoose = app.mongoose;
    var ObjectId = mongoose.Schema.ObjectId;
    let message = new mongoose.Schema({
        // 用户名
        userid: { type: ObjectId },
        // 消息类型[点赞、系统、文字...]
        type: { type: ObjectId },
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

    message.index({ userid: 1 }, { unique: true });

    return mongoose.model("message", message);
}
