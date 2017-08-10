// const RongAPI = require("co-rongcloud-api");
// const api = new RongAPI("", "");

var rongcloudSDK = require( 'rongcloud-sdk' );
rongcloudSDK.init("appkey", "appsecret");

const dissmissgroup = async (userid, groupid) => {
	// console.log("a am here!");
	// try {
	// 	let ret = await api.groupDismiss(userid, groupid);
	// 	console.log("a am here!", ret);
	// 	return ret;
	// } catch (e) {
	// 	console.log("dissmissgroup err!", e);
	// }
	await 100;	
	rongcloudSDK.group.dismiss(userid,groupid,'json',function(err, resultText){
		console.log("err",err);
		console.log("resultText",resultText);
	});
};

module.exports = {
	dissmissgroup
};
