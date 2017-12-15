'use strict';
const ioc = require('socket.io-client');
const mm = require('egg-mock');

const { assert } = require('egg-mock/bootstrap');
describe('test/io/io.test.js', () => {

    afterEach(() => {
        mm.restore();
    });

    function client(nsp, opts = {}) {
        let url = 'http://127.0.0.1:' + opts.port + (nsp || '');
        if (opts.query) {
            url += '?' + opts.query;
        }
        return ioc(url, opts);
    }

    it('io controller should works ok', done => {
        const app = mm.cluster({
            workers: 1,
            sticky: false,
        });
        app.ready().then(() => {
            console.log('process.env', app.port);
            const socket = client('tomatobang', { port: app.port + '/' });
            socket.on('connect', () => {
                const userid = 123;
                const tomato = {
                    title: 'test io',
                };
                const countdown = 25;
                socket.emit('load_tomato', { userid });
                socket.emit('start_tomato', { userid, tomato, countdown });
                socket.emit('break_tomato', { userid, tomato });
                assert(countdown);
            });
            socket.on('disconnect', () => app.close().then(done, done));
            socket.on('load_tomato_succeed', msg => {
                console.log(msg);
            });
            socket.on('new_tomate_added', msg => {
                console.log(msg);
            });
            socket.on('other_end_start_tomato', msg => {
                console.log(msg);
            });
            socket.on('other_end_break_tomato', msg => {
                console.log(msg);
            });

            setTimeout(() => {
                socket.close();
            }, 3000);
        });
    });
});
