'use strict';

import BaseController from './base';
import {
  user_friendValidationRule,
  stateValidationRule,
} from '../validate/user_friend';

export default class User_friendController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.userFriend;
  }

  /**
   * @api {getFriendReqList} /api/user_friend [load user friend list]
   */
  async getUserFriends() {
    const { ctx } = this;
    const query = ctx.request.query;
    const state = query.state;
    const userid = ctx.request['currentUser']._id;
    if (userid) {
      if (state && (state === '1' || state === '2' || state === '3')) {
        const result = await this.service.getUserFriends(userid, state);
        ctx.body = result;
        ctx.status = 200;
      } else {
        ctx.body = '请求不合法！';
        ctx.status = 403;
      }
    } else {
      ctx.body = '请求不合法！';
      ctx.status = 403;
    }
  }

  /**
   * @api {getFriendReqList} /api/user_friend/request_add_friend [request friend list]
   */
  async getFriendReqList() {
    const { ctx } = this;
    let conditions: any;
    conditions = {};
    const query = ctx.request.query;
    conditions.to = ctx.request['currentUser']._id;
    if (query.conditions) {
      conditions = JSON.parse(query.conditions);
    }
    const result = await this.service.findAll(query, conditions);
    ctx.body = result;
    ctx.status = 200;
  }

  /**
   * @api {requestAddFriend} /api/user_friend/request_add_friend [request add friend]
   */
  async requestAddFriend() {
    const { ctx, app } = this;
    const invalid = app['validator'].validate(
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

    const from = ctx.request.body.from;
    const to = ctx.request.body.to;
    const isUserExist =
      (await ctx.service.user.hasUser(from)) &&
      (await ctx.service.user.hasUser(to));
    if (!isUserExist) {
      ctx.body = {
        status: 'fail',
        description: '用户不存在',
      };
      return;
    }

    if (from === to) {
      ctx.body = {
        status: 'fail',
        description: '不能添加自己为好友!',
      };
      return;
    }

    const user_friend = {
      from,
      to,
      request_time: new Date().valueOf(),
      state: 1,
    };
    ctx.service.userFriend.create(user_friend);
    ctx.body = {
      success: true,
    };
  }

  /**
   * @api {responseAddFriend} /api/user_friend/response_add_friend [response friend request]
   */
  async responseAddFriend() {
    const { ctx, app } = this;
    const invalid = app['validator'].validate(
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
