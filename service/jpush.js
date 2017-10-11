const JPush = require("jpush-sdk")
let jpushClient = JPush.buildClient('f240850b36aea20535b81df8', '189cbc42a1044b1ac2f2ddb1')

// easy push test
// alias: 6,7
exports.pushMessage = function (alias,alert, title) {
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