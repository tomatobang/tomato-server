'use strict';
const BaseService = require('./base');

class User_friendService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.UserFriend;
  }

  /**
   * 回复好友请求
   * @param { String } recordid 记录编号
   * @param { Number } state 返回状态
   * @return { Boolean } 是否成功
   */
  async updateState(recordid, state) {
    const model = this.ctx.model.UserFriend;
    await model.updateOne(
      { _id: recordid },
      { state, response_time: new Date().valueOf() },
      {}
    );
    return true;
  }


}

module.exports = User_friendService;
