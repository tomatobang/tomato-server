'use strict';
import BaseService from './base';

export default class User_friendService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.UserFriend;
  }

  /**
   * 获取好友列表
   * @param { String } userid 用户编号
   */
  async getUserFriends(userid, state) {
    const model = this.ctx.model.UserFriend;

    const result = await model
      .find({ $or: [{ from: userid }, { to: userid }], state: state })
      .populate({ path: 'from', select: 'username displayName bio img email sex location' })
      .populate({ path: 'to', select: 'username displayName bio img email sex location' })
      .sort('-response_time')
      .select('response_time from to state');

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
