'use strict';
import BaseController from './base';
export default class MessageController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.message;
  }

  /**
   * load user unread messages
   */
  async loadUnreadMessages() {
    const { ctx, app } = this;
    const query = ctx.request.query;
    let userid;
    if (ctx.request['currentUser']) {
      userid = ctx.request['currentUser']._id;
    } else {
      ctx.status = 403;
      ctx.body = '请求不合法！';
    }
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
      conditions.create_at = {
        $gt: new Date(startTime),
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
