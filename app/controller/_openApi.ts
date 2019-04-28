'use strict';
import { Controller } from 'egg';

export default class BillController extends Controller {
    /**
    * send message to friend
    */
    async sendMessage() {
        const { ctx, app } = this;
        // 事件名称
        let evtName = ctx.request.body.evtName;
        let friendid = ctx.request.body.friendid;
        let message = ctx.request.body.message;
        // TODO: 找到当前终端下下对应的 socket，发送消息
        // TODO: 如果找不到则需要写失败日志
        ctx.status = 200;
        ctx.body = 'ok';
    }

}
