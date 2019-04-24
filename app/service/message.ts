'use strict';
import BaseService from './base';

export default class MessageService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.Message;
  }

  /**
   * 加载用户未读消息
   */
  async loadUnreadMessages(conditions) {
    const Message = this.model;
    console.log(conditions);
    const res = await Message.aggregate([
      {
        $match: conditions,
      },
      {
        $project: {
          create_at: 1,
          content: 1,
          from: 1,
        },
      },
      {
        $group: {
          _id: '$from',
          messages: {
            // 好友未读消息列表
            $push: {
              _id: '$_id',
              content: '$content',
              create_at: '$create_at',
            },
          },
          count: { $sum: 1 }, // 统计总数
        },
      },
      {
        $sort: { create_at: 1 },
      },
    ]);
    return res;
  }

  /**
   * 更新已读状态
   * @param id 消息编号
   * @param has_read 已读标识
   */
  async updateMessageState(id, has_read) {
    const Message = this.model;
    const result = await Message.findByIdAndUpdate(
      id,
      {
        $set: { has_read },
      },
      {
        new: false,
      }
    ).exec();
    return result;
  }

  /**
   * 加载某用户最新消息日期
   * @param userid 用户编号
   */
  async loadLatestMessageTime(userid) {
    const Message = this.model;
    const latestMsg = await Message.find({ to: userid })
      .sort({ create_at: -1 })
      .limit(1)
      .exec();
    if (latestMsg && latestMsg.length > 0) {
      return latestMsg[0].create_at;
    } else {
      return null;
    }
  }
}
