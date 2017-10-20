'use strict';
/**
 * 接口请求前验证
 */
module.exports = (option, app) => {
    return async function (ctx, next) {
        if (ctx.url.startsWith('/api/login') && ctx.method !== 'GET') {
            return next();
        }
        
        // for test
        // if(ctx.url.startsWith('/api/user/headimg')){
        //     return next();
        // }

        const headers = ctx.request.headers;
        let token;
        try {
            token = headers["authorization"];
        } catch (err) {
            return (ctx.body = {
                status: "fail",
                description: err
            });
        }

        if (!token) {
            return (ctx.body = {
                status: "fail",
                description: "Token not found"
            });
        }

        const result = ctx.helper.tokenService.verifyToken(token);
        if (result === false) {
            return (ctx.body = {
                status: "fail",
                description: "Token verify failed"
            });
        }
        console.log("当前用户token:", token);
        let reply = await app.redis.get(token);
        console.log("当前用户:", reply);
        if (reply) {
            let currentUser = JSON.parse(reply);
            ctx.request.currentUser = currentUser;
            return next();
        } else {
            return (ctx.body = {
                status: "fail",
                description: "Token invalid"
            });
        }
    };
};





