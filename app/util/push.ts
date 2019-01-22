'use strict';
const env = process.env;
/**
 * jpush util
 */

const JPush = require('jpush-sdk');
export const JPUSH = {
  pushMessage(alias, alert, title) {
    const jpushClient = JPush.buildClient(
      env.JPUSH_APP_kEY,
      env.JPUSH_MASTER_SECRET,
    );
    jpushClient
      .push()
      .setPlatform(JPush.ALL)
      .setAudience(JPush.alias(alias))
      .setNotification(
        JPush.android(alert, title, 1),
        JPush.ios(alert, 'sound', 1, null, { msg: title })
      )
      .send((err, res) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log('Sendno: ' + res.sendno);
          console.log('Msg_id: ' + res.msg_id);
        }
      });
  }
} 
