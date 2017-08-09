var RongAPI = require('co-rongcloud-api');

var api = new RongAPI(appid, appsecret);
var token = await api.getToken('nick-ma');