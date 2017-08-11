// const RongAPI = require("co-rongcloud-api");
// const api = new RongAPI("", "");

var rongcloudSDK = require("rongcloud-sdk");
rongcloudSDK.init('', '');

const dissmissgroup =  (userid, groupid) => {
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
