/**
 * remq d.ts see： https://github.com/smrchy/rsmq/blob/master/index.d.ts
 */

import * as RedisSMQ from 'rsmq';
let rsmq = new RedisSMQ({ host: '127.0.0.1', port: 6379, ns: 'rsmq' });

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
};
