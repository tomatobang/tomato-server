'use strict';
const todoRegularValidationRule = {
    userid: {
        type: 'string',
        required: true,
        allowEmpty: false,
    },
    title: {
        type: 'string',
        required: true,
        allowEmpty: false,
        min: 1,
        max: 50,
    },
};

module.exports = {
    todoRegularValidationRule,
};
