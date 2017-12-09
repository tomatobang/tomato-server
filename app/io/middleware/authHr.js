'use strict';

module.exports = (app) => {
    return function* (next) {
        console.log('auth!');
        yield* next;
        console.log('disconnect!');
        let socket = this.socket;
        app.redis.get("big:screen").then(sid => {
            if (sid == socket.id) {
                app.redis.del("big:screen").then(() => { });
            }
        });
    };
};
