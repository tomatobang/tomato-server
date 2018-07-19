/**
 * remq d.ts see： https://github.com/smrchy/rsmq/blob/master/index.d.ts
 */
import { Application } from 'egg';
import * as RedisSMQ from 'rsmq';
const RSMQWorker = require('rsmq-worker');
const rsmq = new RedisSMQ({ host: '127.0.0.1', port: 6379, ns: 'rsmq' });

export const mqUtil = {
  create: (name: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      rsmq.createQueue({ qname: name }, (err, resp) => {
        if (err) {
          reject(err);
        }
        if (resp === 1) {
          resolve(true);
          console.log('queue created');
        }
      });
    });
  },

  send: (name, msg): Promise<any> => {
    return new Promise((resolve, reject) => {
      rsmq.sendMessage(
        {
          message: msg,
          qname: name,
        },
        (err, mesgID) => {
          if (err) {
            reject(err);
          }
          if (mesgID) {
            resolve(mesgID);
            console.log('Message sent. ID:', mesgID);
          }
        }
      );
    });
  },

  receive: (name): Promise<any> => {
    return new Promise((resolve, reject) => {
      rsmq.receiveMessage(
        { qname: name },
        (err, resp: RedisSMQ.QueueMessage) => {
          if (err) {
            reject(err);
          }
          if (resp.id) {
            resolve(resp);
            console.log('Message received.', resp);
          } else {
            resolve('');
            console.log('No messages for me...');
          }
        }
      );
    });
  },

  listen: (name, app: Application) => {
    var worker = new RSMQWorker(name);

    worker.on('message', async (msg, next, id) => {
      console.log('Message id : ' + id);
      console.log(msg);
      /**
       * msg:
       * {
       *    evtName,
       *    message,
       * }
       */
      await notify(name, msg.evtName, msg.messagge);

      next();
    });

    worker.on('error', (err, msg) => {
      console.log('ERROR', err, msg.id);
    });
    worker.on('exceeded', msg => {
      console.log('EXCEEDED', msg.id);
    });
    worker.on('timeout', msg => {
      console.log('TIMEOUT', msg.id, msg.rc);
    });

    worker.start();

    /**
     * send message
     * @param {string} userid userid
     * @param {string} evtName socket.io event name
     * @param {string} message message
     */
    async function notify(userid, evtName, message) {
      const redisChatService = app.util.redis.redisChatService;
      const loginEnds = await redisChatService.findUserSocket(app, userid);
      if (loginEnds && loginEnds.length > 0) {
        for (const end of loginEnds) {
          if (end) {
            await app.io
              .of('/chat')
              .to(end)
              .emit(evtName, message);
          }
        }
      }
    }
  },
};
