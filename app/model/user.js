module.exports = app => {
    /**
     * 用户
    */
    const mongoose = app.mongoose;
    let user = new mongoose.Schema({
        // 用户名
        username: String,
        // 密码
        password: String,
        // 显示名称
        displayName: String,
        // 邮箱
        email: String,
        // 融云 token
        rongyun_token: String
    });

    // 融云toke (未验证)
    user.statics.getRongyunToken = (userid, username, headImg) => {
        return new Promise((resolve, reject) => {
            let that = this;
            that.find({ _id: userid }, (err, user) => {
                if (!user || user.length == 0) {
                    reject("用户不存在");
                } else {
                    if (!user[0].rongyun_token) {
                        rongcloudSDK.user.getToken(
                            user._id,
                            user.username,
                            headImg,
                            (err, reponse) => {
                                if (err) {
                                    reject("获取融云token err:" + err);
                                } else {
                                    let result = JSON.parse(reponse);
                                    if (result.code === 200) {
                                        console.log(
                                            "获取融云token suceess:" + result.token
                                        );
                                        let conditions = { _id: userid },
                                            update = {
                                                $set: { rongyun_token: result.token }
                                            };

                                        updateUser(conditions, update, {});
                                        resolve(result.token)
                                    }
                                }
                            }
                        );
                    } else {
                        // 用户名有更改
                        if (username != user[0].username) {
                            rongcloudSDK.user.refresh(
                                userid,
                                username,
                                user[0].headimg,
                                "json",
                                () => {
                                    let conditions = { _id: userid },
                                        update = { $set: { username: username } };
                                    updateUser(conditions, update, {});
                                }
                            );
                        }
                        resolve(user[0].rongyun_token);
                    }
                }
            });

            function updateUser(conditions, update, option) {
                that.update(conditions, update, options, function (err, docs) {
                    if (err) {
                        console.log("update user err:" + err);
                    } else {
                        console.log("update user suc:" + docs.username);
                    }
                });
            }
        });

    };
    return mongoose.model("user", user);
}
