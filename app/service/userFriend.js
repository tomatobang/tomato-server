'use strict';
const BaseService = require('./base');

class User_friendService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.UserFriend;
  }

  async getUserFriends(userid) {
    const model = this.ctx.model.UserFriend;
    const result = await model
      .find({ $or: [{ from_userid: userid }, { to_userid: userid }] })
      .populate(
        { path: 'from_userid', select: 'username bio img email sex location' },
        { path: 'to_userid', select: 'username bio img email sex location' }
      )
      .sort('-response_time')
      .select('response_time from_userid to_userid');

    return result;
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
