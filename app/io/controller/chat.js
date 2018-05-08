'use strict';

/**
 *  消息服务
*/
const {
	user_friendValidationRule,
	stateValidationRule,
} = require('../../validate/user_friend');

module.exports = app => {
	class Controller extends app.Controller {
		async connection() {
			return;
		}

		async login() {
			const obj = this.ctx.args[0];
			const socket = this.ctx.socket;
			const { userid } = obj;
			const userLoginEnds = await app.redis.get('chat:user:socket:' + userid);
			if (userLoginEnds && userLoginEnds.length > 0) {
				// 已登录
			} else {
				await app.redis.sadd('chat:user:socket:' + userid, socket.id);
				await app.redis.set('chat:socket:user:' + socket.id, userid);
			}
			return;
		}

		/**
     * 发送消息
     */
		async sendMessage() {
			const obj = this.ctx.args[0];
			/**
       * from:{userid}
       * to:{userid}
       * message:string
       */
			const { from, to } = obj;
			let { message } = obj;
			if (message.length >= 516) {
				message = message.slice(0, 500) + '...(输入太长，系统自动截断)';
			}
			if (message) {
				const to_user_ends = await app.redis.smembers('chat:user:socket:' + to);
				for (const end of to_user_ends) {
					if (end) {
						await app.io
							.of('/chat')
							.to(end)
							.emit('message_received', { from, message });
					}
				}
			}
			return;
		}

		/**
     * 加载好友列表
     */
		async loadOnlineFriendList() {
			const obj = this.ctx.args[0];
			/**
       * userid:string
       */
			const { userid } = obj;
			if (userid) {
				await app.io
					.of('/chat')
					.to(this.socket.id)
					.emit('online_friendlist_received', {
						friendlist: [] /* TODO: 确定算法 */,
					});
			}
		}

		/**
     * 发送好友请求
     */
		async requestAddFriend() {
			/**
       * userid:string
       * to:{userid}
       * state:number
       */

			const { ctx, app } = this;
			const obj = ctx.args[0];
			const { from_userid, to_userid } = obj;
			const invalid = app.validator.validate(user_friendValidationRule, {
				from_userid,
				to_userid,
			});
			if (invalid) {
				await app.io
					.of('/chat')
					.to(this.socket.id)
					.emit('fail', { status: 'fail', description: '请求参数错误！' });
			}

			const isUserExist =
				(await ctx.service.user.hasUser(from_userid)) &&
				(await ctx.service.user.hasUser(to_userid));
			if (!isUserExist) {
				await app.io
					.of('/chat')
					.to(this.socket.id)
					.emit('fail', { status: 'fail', description: '用户不存在' });
			}

			if (from_userid === to_userid) {
				await app.io
					.of('/chat')
					.to(this.socket.id)
					.emit('fail', { status: 'fail', description: '不能添加自己为好友' });
			}

			const user_friend = {
				from_userid,
				to_userid,
				request_time: new Date().valueOf(),
				state: 1,
			};

			await this.service.userFriend.create(user_friend);

			await app.io
				.of('/chat')
				.to(this.socket.id)
				.emit('requestAddFriend_success', {});
		}

		async responseAddFriend() {
			const { ctx, app } = this;
			const obj = ctx.args[0];
			const { recordId, state } = obj;
			const invalid = app.validator.validate(stateValidationRule, {
				recordId,
				state,
			});
			if (invalid) {
				await app.io
					.of('/chat')
					.to(this.socket.id)
					.emit('fail', { status: 'fail', description: '请求参数不合法！' });
			}
			await ctx.service.userFriend.updateState(recordId, state);
			await app.io
				.of('/chat')
				.to(this.socket.id)
				.emit('responseAddFriend_success', {});
		}

		/**
     * 断开连接
     */
		async disconnect() {
			const socket = this.ctx.socket;
			app.redis.get(socket.id).then(userid => {
				this.ctx.logger.info('userid!', userid);
				if (userid) {
					app.redis.srem('chat:user:socket:', userid).then(() => {});
					app.redis.del('chat:socket:user:' + socket.id).then(() => {});
				}
			});
			return;
		}
	}
	return Controller;
};
