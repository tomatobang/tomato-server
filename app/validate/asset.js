'use strict';
const assetValidationRule = {
    userid: {
        type: 'string',
        required: true,
        allowEmpty: false,
    },
    name: {
        type: 'string',
        required: true,
        allowEmpty: false,
        min: 1,
        max: 50,
    },
};

module.exports = {
    assetValidationRule,
};
