const RongAPI = require("co-rongcloud-api");
const api = new RongAPI("", "");
var co = require("co");

const dissmissgroup = async (userid, groupid) => {
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
};

module.exports = {
	dissmissgroup
};
