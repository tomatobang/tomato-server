'use strict';

module.exports = {
    write: true,
    prefix: '^',
    test: [
    ],
    dep: [
        "egg",
        "egg-alinode",
        "egg-cors",
        "egg-mongoose",
        "egg-redis",
        "egg-scripts",
        "egg-socket.io",
        "egg-static",
        "egg-validate",
        "egg-view-nunjucks",
    ],
    devdep: [
        'autod-egg',
        'autod',
        'egg-bin',
        'egg-mock',
        'eslint',
        'eslint-config-egg',
    ],
    exclude: [
        './test/fixtures',
        './public',
        './coverage',
        './run'
    ],
};