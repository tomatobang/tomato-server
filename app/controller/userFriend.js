'use strict';

const BaseController = require('./base');
const {
  user_friendValidationRule,
  stateValidationRule,
} = require('../validate/user_friend');

class User_friendController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.userFriend;
  }

  /**
   * @api {getFriendReqList} /api/user_friend/request_add_friend [请求添加为好友]
   */
  async getFriendReqList() {
    const { ctx } = this;
    let conditions = {};
    const query = ctx.request.query;
    if (ctx.request.currentUser) {
      conditions.to_userid = ctx.request.currentUser._id;
    }
    if (query.conditions) {
      conditions = JSON.parse(query.conditions);
    }
    const result = await this.service.findAll(query, conditions);
    ctx.body = result;
    ctx.status = 200;
  }

  /**
   * @api {requestAddFriend} /api/user_friend/request_add_friend [请求添加为好友]
   */
  async requestAddFriend() {
    const { ctx, app } = this;
    const invalid = app.validator.validate(
      user_friendValidationRule,
      ctx.request.body
    );
    if (invalid) {
      ctx.body = {
        status: 'fail',
        description: '请求参数错误！',
      };
      return;
    }

    const from_userid = ctx.request.body.from_userid;
    const to_userid = ctx.request.body.to_userid;
    const isUserExist =
      (await ctx.service.user.hasUser(from_userid)) &&
      (await ctx.service.user.hasUser(to_userid));
    if (!isUserExist) {
      ctx.body = {
        status: 'fail',
        description: '用户不存在',
      };
      return;
    }

    if (from_userid === to_userid) {
      ctx.body = {
        status: 'fail',
        description: '不能添加自己为好友!',
      };
      return;
    }

    const user_friend = {
      from_userid,
      to_userid,
      request_time: new Date().valueOf(),
      state: 1,
    };
    ctx.service.userFriend.create(user_friend);
    ctx.body = {
      success: true,
    };
  }

  /**
   * @api {responseAddFriend} /api/user_friend/response_add_friend [回复添加好友请求]
   */
  async responseAddFriend() {
    const { ctx, app } = this;
    const invalid = app.validator.validate(
      stateValidationRule,
      ctx.request.body
    );
    if (invalid) {
      ctx.body = {
        status: 'fail',
        description: '请求参数不合法！',
      };
      return;
    }
    const recordId = ctx.request.body.recordId;
    const state = ctx.request.body.state;
    await ctx.service.userFriend.updateState(recordId, state);
    ctx.body = {
      success: true,
    };
  }
}
module.exports = User_friendController;
