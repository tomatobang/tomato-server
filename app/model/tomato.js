module.exports = app => {
    /**
     * 番茄钟
     */
    const mongoose = app.mongoose;
    let tomato = new mongoose.Schema({
        // 用户编号
        userid: { type: String, default: "" },
        // 开始时间
        startTime: { type: Date },
        // 结束时间
        endTime: { type: Date },
        // 标题
        title: { type: String, default: "" },
        // 目标
        target: String,
        // 描述
        description: { type: String, default: "" },
        // 任务编号，可空
        taskid: { type: String, default: "" },
        // 是否成功 1:成功 0:失败
        succeed: { type: Number, default: 1 },
        // 中断原因
        breakReason: { type: String, default: "" },
        // 语音路径
        voiceUrl: { type: String, default: "" }
    });
    return mongoose.model("tomato", tomato);
}
