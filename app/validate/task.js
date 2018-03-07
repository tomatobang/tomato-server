'use strict';
const taskValidationRule = {
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

const relateUrlValidationRule = {
  taskid: {
    type: 'string',
    required: true,
    allowEmpty: false,
  },
  relateUrl: {
    type: 'string',
    required: true,
    allowEmpty: false,
    min: 1,
  },
};

module.exports = {
  taskValidationRule,
  relateUrlValidationRule,
};
