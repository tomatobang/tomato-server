'use strict';
import BaseController from './base';
export default class MessageController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.message;
  }

  /**
   * load history messages
   */
  async loadHistoryMsg() {
    const { ctx } = this;
    const current = ctx.request.body.current || 1;
    const startTime = ctx.request.body.startTime;
    const friendid = ctx.request.body.friendid;

    let userid = ctx.request['currentUser']._id;
    if (!current || current < 1) {
      ctx.status = 403;
      ctx.body = {
        error_msg: '参数格式不正确!',
      };
      return;
    }
    // startTime: ISO Date
    const lteDate = new Date(startTime);
    const ret = await this.service.loadByPagination(
      {
        create_at: { $lte: lteDate },
        current,
        $or: [
          { from: userid, to: friendid },
          { from: friendid, to: userid },
        ],
        pageSize: 6,
        sorter: {
          create_at: -1,
        },
      },
      '_id type from to content create_at has_read'
    );
    ctx.status = 200;
    ctx.body = ret;
  }

  /**
   * load user unread messages
   */
  async loadUnreadMessages() {
    const { ctx, app } = this;
    const query = ctx.request.query;
    let userid;
    userid = ctx.request['currentUser']._id;
    let startTime = query.startTime;
    if (startTime) {
      console.log('startTime');
      startTime = new Date(parseInt(startTime, 10)).toISOString();
    }
    let conditions;
    conditions = {
      to: app.mongoose.Types.ObjectId(userid),
      has_read: false,
      deleted: false,
    };
    if (startTime) {
      const gtDate = startTime;
      conditions.create_at = {
        $gt: gtDate,
      };
    }
    const result = await this.service.loadUnreadMessages(conditions);
    const lst_create_at = await this.service.loadLatestMessageTime(
      app.mongoose.Types.ObjectId(userid)
    );
    console.log('loadLatestMessageTime', lst_create_at);
    ctx.body = {
      messages: result,
      lst_create_at: lst_create_at,
    };
  }

  /**
   * update user messages state by message id
   */
  async updateMessageState() {
    const { ctx } = this;
    let id = ctx.request.body.id;
    let has_read = ctx.request.body.has_read;
    const result = await this.service.updateMessageState(id, has_read);
    ctx.status = 200;
    ctx.body = result;
  }
}
