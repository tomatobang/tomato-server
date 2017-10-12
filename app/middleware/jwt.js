'use strict';
/**
 * 接口请求前验证
 */
module.exports = (option, app) => {
    return async function (ctx, next) {
        if (ctx.url.startsWith('/api/user') && ctx.method !== 'GET' && !ctx.url.startsWith('/api/user/')) {
            return next();
        }

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

        const result = app.helper.tokenService.verifyToken(token);
        if (result === false) {
            return (ctx.body = {
                status: "fail",
                description: "Token verify failed"
            });
        }

        let reply = await app.redis.getAsync(token);
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





