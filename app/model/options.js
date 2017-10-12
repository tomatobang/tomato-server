module.exports = app => {
    /**
     * 网站说明
     */
    const mongoose = app.mongoose;
    let option = new mongoose.Schema({
        // 键
        key: String,
        // 值
        value: mongoose.Schema.Types.Mixed,
        // 描述
        desc: String
    });
    return mongoose.model("option", option);
}
