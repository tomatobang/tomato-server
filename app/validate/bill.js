'use strict';
const billValidationRule = {
    userid: {
        type: 'string',
        required: true,
        allowEmpty: false,
    },
    amount: {
        type: 'number',
        required: true,
        allowEmpty: false,
    },
};

module.exports = {
    billValidationRule,
};
