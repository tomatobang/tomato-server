'use strict';
import BaseController from './base';
export default class MessageController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.message;
  }

  /**
   * 加载用户未读消息
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
        $gte: new Date(startTime),
      };
    }
    const result = await this.service.loadUnreadMessages(conditions);
    ctx.body = result;
  }

  /**
   * 更新消息已读状态
   */
  async updateMessageState() {
    const { ctx, app } = this;
    let id = ctx.request.body.id;
    let has_read = ctx.request.body.has_read;
    const result = await this.service.updateMessageState(id, has_read);
    ctx.status = 200;
    ctx.body = result;
  }
}
