'use strict';
var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

module.exports.create = async ({ body }, context) => {
  const db = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'datapoints',
    Item: JSON.parse(body)
  };

  try {
    const data = await db.put(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch(e) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Error',
        input: e,
      }),
    };
  }
};

module.exports.index = async (event, context) => {
  const db = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'averages'
  };

  try {
    const data = await db.scan(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch(e) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Error',
        input: e,
      }),
    };
  }
};

