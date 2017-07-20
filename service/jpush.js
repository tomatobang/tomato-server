const JPush = require("jpush-sdk")
let client = JPush.buildClient('your appKey', 'your masterSecret')

//easy push
client.push().setPlatform(JPush.ALL)
    .setAudience(JPush.ALL)
    .setNotification('Hi, JPush', JPush.ios('ios alert', 'happy', 5))
    .send(function(err, res) {
        if (err) {
            console.log(err.message)
        } else {
            console.log('Sendno: ' + res.sendno)
            console.log('Msg_id: ' + res.msg_id)
        }
    });