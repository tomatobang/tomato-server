'use strict';

/**
 * 测试步骤:
 * 1. 模拟用户 chat1、chat2
 * 2. chat1 向 chat2 发请求
 * 3. chat2 向 chat1 回复请求
 *    + 同意
 *    + 拒绝
 *    + 忽略
 * 4. chat1 向 chat2 发消息
 * 5. chat2 向 chat1 发消息
 * 6. chat1\chat2 加载在线好友列表
 * 6. 断开好友关系
 */

import * as ioc from 'socket.io-client';
import * as assert from 'assert';
import mm from 'egg-mock';

describe('test/io/chat.io.test.js', () => {
  const zhangs = '5b0f712e24b71d2cc029bf11';
  const lisi = '5b0f714924b71d2cc029bf12';

  afterEach(() => {
    mm.restore();
  });

  function client(nsp, opts: any) {
    let url = 'http://127.0.0.1:' + opts.port + (nsp || '');
    if (opts.query) {
      url += '?' + opts.query;
    }
    return ioc(url, opts);
  }

  it('chat io controller should works ok', done => {
    const app = mm.cluster({
      // workers: 1,
      // sticky: false,
    });

    app.ready().then(() => {
      console.log('process.env', app['port']);
      /**
       * chat1:zhangs
       */
      const socket1 = client('chat', { port: app['port'] + '/' });
      socket1.on('connect', () => {
        const from = zhangs;
        const to = lisi;
        const flag = 1;
        socket1.emit('login', { userid: from });
        socket1.emit('load_online_friend_list', { userid: from });
        socket1.emit('request_add_request', { from, to });
        assert(flag);
      });

      socket1.on('message_received', msg => {
        console.log(msg);
        const from = zhangs;
        const to = lisi;
        socket1.emit('send_message', {
          from,
          to,
          message: 'i receive your message!',
        });
      });
      socket1.on('requestAddFriend_success', msg => {
        console.log(msg);
      });
      socket1.on('friend_offline', msg => {
        console.log(msg);
      });
      socket1.on('friend_online', msg => {
        console.log(msg);
      });
      socket1.on('new_added_friend', msg => {
        console.log(msg);
      });
      socket1.on('fail', msg => {
        console.log(msg);
      });

      setTimeout(() => {
        socket1.close();
      }, 3000);
      // socket1.on('disconnect', () => app.close().then(done, done));

      /**
       * chat2
       */
      const socket2 = client('chat', { port: app['port'] + '/' });
      socket2.on('connect', () => {
        const flag = 1;
        assert(flag);
        const from = lisi;
        socket2.emit('login', { userid: from });
        socket2.emit('load_online_friend_list', { userid: from });
      });

      socket2.on('receive_friend_request', msg => {
        console.log(msg);
        const recordId = '1232';
        const from = lisi;
        const to = zhangs;
        socket2.emit('response_friend_request', {
          recordId,
          from,
          to,
          state: 2,
        });
      });

      socket2.on('responseAddFriend_success', msg => {
        console.log(msg);
        // 加载好友列表
        const userid = lisi;
        socket2.emit('load_online_friend_list', { userid });
        const from = lisi;
        const to = zhangs;
        socket2.emit('send_message', {
          from,
          to,
          message: 'we are friend now!',
        });
      });
      socket2.on('friend_offline', msg => {
        console.log(msg);
      });
      socket2.on('friend_online', msg => {
        console.log(msg);
      });
      socket2.on('new_added_friend', msg => {
        console.log(msg);
      });
      socket2.on('fail', msg => {
        console.log(msg);
      });
      setTimeout(() => {
        socket2.close();
      }, 3000);
      socket2.on('disconnect', () => {
        console.log('socket2 closed!!!');
        app.close().then(done, done);
      });
    });
  });
});
