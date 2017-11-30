module.exports = app => {
    /**
     * 用户
    */
    const mongoose = app.mongoose;
    let user = new mongoose.Schema({
        // 用户名
        username: String,
        // 密码
        password: String,
        // 显示名称
        displayName: String,
        // 头像
        img: String,
        // 邮箱
        email: String,
        // 性别
        sex: String,
        // 位置
        location: String
    });

    return mongoose.model("user", user);
}
