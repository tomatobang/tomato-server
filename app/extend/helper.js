// app/extend/helper.js
const moment = require('moment');
exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();

/**
 * token 服务
 */
const jwt = require('jsonwebtoken')
const config = require('../../config/config.default')
let secret = config.token.tokenSecret;
let expiresIn = config.token.tokenExpiresIn;
exports.tokenService = {

  createToken(userinfo) {
    let token = jwt.sign(userinfo, secret, {
      expiresIn
    })
    return token
  },

  verifyToken(token) {
    if (!token) {
      return false
    }

    try {
      let result = jwt.verify(token, secret)
      return result
    } catch (err) {
      return false
    }
  },

  expiresIn

}


/**
 * 极光推送服务
 */
const JPush = require("jpush-sdk")
let jpushClient = JPush.buildClient('f240850b36aea20535b81df8', '189cbc42a1044b1ac2f2ddb1')

// easy push test
// alias: 6,7
exports.pushMessage = function (alias, alert, title) {
  client.push().setPlatform(JPush.ALL)
    .setAudience(JPush.alias(alias))
    .setNotification(JPush.android(alert, title, 1), JPush.ios(alert, 'sound', 1, null, { msg: title }))
    .send(function (err, res) {
      if (err) {
        console.log(err.message)
      } else {
        console.log('Sendno: ' + res.sendno)
        console.log('Msg_id: ' + res.msg_id)
      }
    });
};



const RongAPI = require("co-rongcloud-api");
const api = new RongAPI("", "");
const co = require("co");
exports.rongyunUtil = {
  async dissmissgroup(userid, groupid) {
    console.log("a am here!");
    try {
      let gen = await api.groupDismiss(userid, groupid);
      console.log("gen!", gen);
      co(gen).then(data => {
        console.log("data!", data);
      });
      return false;
    } catch (e) {
      console.log("dissmissgroup err!", e);
    }
  }
}

