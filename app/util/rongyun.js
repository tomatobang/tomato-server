'use strict';

/**
 * 融云:解散群组
 */
const RongAPI = require('co-rongcloud-api');
const api = new RongAPI('', '');
const co = require('co');
exports.rongyunUtil = {
  async dissmissgroup(userid, groupid) {
    console.log('a am here!');
    try {
      const gen = await api.groupDismiss(userid, groupid);
      console.log('gen!', gen);
      co(gen).then(data => {
        console.log('data!', data);
      });
      return false;
    } catch (e) {
      console.log('dissmissgroup err!', e);
    }
  },
};
