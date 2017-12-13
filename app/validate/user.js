'use strict';
const userValidationRule = {
    username: {
        type: 'string',
        required: true, allowEmpty: false,
    },
    password: {
        type: 'password', required: true, allowEmpty: false, min: 6, max: 25,
    },
    displayName: {
        type: 'string',
        required: false,
    },
    img: {
        type: 'string',
        required: false,
    },
    email: {
        type: 'email', required: false, allowEmpty: false,
        format: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    sex: {
        type: 'string',
        required: false,
    },
    location: {
        type: 'string',
        required: false,
    },
};

module.exports = userValidationRule;
