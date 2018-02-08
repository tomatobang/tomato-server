'use strict';

const bcrypt = require('bcryptjs');
module.exports = app => {
  /**
   * 用户
   */
  const saltRounds = 10;
  const mongoose = app.mongoose;
  const user = new mongoose.Schema({
    // 用户名
    username: String,
    // 密码
    password: String,
    // 显示名称
    displayName: String,
    // 签名
    bio: String,
    // 头像
    img: String,
    // 邮箱
    email: String,
    // 性别
    sex: String,
    // 位置
    location: String,

    // 是否屏蔽
    is_block: { type: Boolean, default: false },
    // 创建时间
    create_at: { type: Date, default: Date.now },
    // 更新时间
    update_at: { type: Date, default: Date.now },
    // 等级
    level: { type: Number, default: 1 },
    // 是否活跃
    active: { type: Boolean, default: false },
    // 是否已删除
    deleted: { type: Boolean, default: false },
  });

  user.index({ username: 1 }, { unique: true });

  user.pre('save', async function(next) {
    const now = new Date();
    if (this.password) {
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
    this.update_at = now;
    next();
  });
  user.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  return mongoose.model('user', user);
};
