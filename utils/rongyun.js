const RongAPI = require('co-rongcloud-api');
const api = new RongAPI(appid, appsecret);

const dissmissgroup = (userid,groupid)=>{
    let ret = await api.groupDismiss(userid,groupid);
}

module.export = {
    dissmissgroup
}