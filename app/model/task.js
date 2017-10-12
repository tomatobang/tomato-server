module.exports = app => {
    /**
     * 任务
     */
    const mongoose = app.mongoose;
    let task = new mongoose.Schema({
        // 用户编号
        userid: String,
        // 标题
        title: String,
        // 目标
        target: String,
        // 描述
        description: { type: String, default: "" },
        // 番茄个数
        num: { type: Number, default: 0 },
        // 是否激活
        isActive: { type: Boolean, default: false },
        // 语音路径
        voiceUrl: { type: String, default: "" }
    });
    return mongoose.model("task", task);
}
