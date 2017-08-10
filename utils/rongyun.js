// const RongAPI = require("co-rongcloud-api");
// const api = new RongAPI("", "");

var rongcloudSDK = require("rongcloud-sdk");
rongcloudSDK.init('pgyu6atqyw7hu', 'LM6UB6WiLb5');

const dissmissgroup =  (userid, groupid) => {
	// console.log("a am here!");
	// try {
	// 	let ret = await api.groupDismiss(userid, groupid);
	// 	console.log("a am here!", ret);
	// 	return ret;
	// } catch (e) {
	// 	console.log("dissmissgroup err!", e);
	// }
	let promise = new Promise((resolve, reject) => {
		rongcloudSDK.group.dismiss(userid, groupid, "json", function(
			err,
			resultText
		) {
			if (!err) {
				resolve(true);
			} else {
				reject(false);
			}
			console.log("err", err);
			console.log("resultText", resultText);
		});
	});
	return promise;
};

module.exports = {
	dissmissgroup
};
