'use strict';

module.exports = app => {
    /**
     * 版本管理(主要用于 Android 手机本地更新，开发版本管理可以直接使用 Github )
    */
    const mongoose = app.mongoose;
    const user = new mongoose.Schema({
        // 版本号
        version: String,
        // 更新内容
        updateContent: String,
        // 下载地址
        downloadUrl: String,
        // 大小
        size: String,
        // 发布时间
        datetime: { type: Date },
        // 删除标识
        deleted: { type: Boolean, default: false },
    });

    return mongoose.model('version', user);
};
