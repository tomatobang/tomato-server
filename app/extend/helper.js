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
 * 日期处理 Util
 */
exports.dateHelper = {
  getCurrentMonthFirst(date) {
    let date = new Date(date);
    date.setDate(1);
    return this.format(date, 'yyyy-MM-dd');
  },
  getCurrentMonthLast(date) {
    let date = new Date(date);
    let currentMonth = date.getMonth();
    let nextMonth = ++currentMonth;
    let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    let oneDay = 1000 * 60 * 60 * 24;
    return this.format(new Date(nextMonthFirstDay - oneDay), 'yyyy-MM-dd');
  },
  getNextMonthFirst(date) {
    let date = new Date(date);
    let currentMonth = date.getMonth();
    let nextMonth = ++currentMonth;
    let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    return this.format(new Date(nextMonthFirstDay), 'yyyy-MM-dd');
  },
  // https://www.cnblogs.com/tugenhua0707/p/3776808.html
  format(datetime, fmt) {
    let o = {
      "M+": datetime.getMonth() + 1,                 //月份 
      "d+": datetime.getDate(),                    //日 
      "h+": datetime.getHours(),                   //小时 
      "m+": datetime.getMinutes(),                 //分 
      "s+": datetime.getSeconds(),                 //秒 
      "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度 
      "S": datetime.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }
}


/**
 * 极光推送服务
 */
const JPush = require("jpush-sdk")
let jpushClient = JPush.buildClient('f240850b36aea20535b81df8', '189cbc42a1044b1ac2f2ddb1')
exports.pushMessage = function (alias, alert, title) {
  jpushClient.push().setPlatform(JPush.ALL)
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


/**
 * 融云:解散群组
 */
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

