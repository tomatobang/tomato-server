'use strict';
const user_friendValidationRule = {
  from: {
    type: 'string',
    required: true,
    allowEmpty: false,
    min: 10,
    max: 30,
  },
  to: {
    type: 'string',
    required: true,
    allowEmpty: false,
    min: 10,
    max: 30,
  },
};

const stateValidationRule = {
  recordId: {
    type: 'string',
    required: true,
    allowEmpty: false,
    min: 10,
    max: 30,
  },
  state: {
    type: 'enum',
    values: [ 1, 2, 3, 4 ],
    required: true,
  },
};

module.exports = {
  user_friendValidationRule,
  stateValidationRule,
};
