'use strict';
var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

module.exports.average = async (event, context) => {
  console.log(average)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  };
};
