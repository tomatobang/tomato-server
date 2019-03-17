'use strict';
const billValidationRule = {
    userid: {
        type: 'string',
        required: true,
        allowEmpty: false,
    },
    type: {
        type: 'enum',
        values: ['支出', '收入'],
        required: true,
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
