'use strict';
var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
const INTERVAL = 1000 * 60 * 10 // 10 minutes

module.exports.average = async (event, context) => {
  let doc = event.Records[0].dynamodb.NewImage;
  doc = AWS.DynamoDB.Converter.unmarshall(doc);

  var db = new AWS.DynamoDB.DocumentClient();
  const moreThenTimestamp = doc.timestamp - (doc.timestamp % INTERVAL);

  var scanQuery = {
    TableName: 'datapoints',
    FilterExpression: 'beer = :beer_name and #stamp between :more_then_timestamp and :less_then_timestamp',
    ExpressionAttributeValues: {
      ':beer_name': doc.beer,
      ':more_then_timestamp': moreThenTimestamp,
      ':less_then_timestamp': doc.timestamp + 1
    },
    ExpressionAttributeNames: {
      "#stamp": "timestamp"
    }
  };

  var response = await db.scan(scanQuery).promise();
  if (!response.Count) return { statusCode: 201, body: '' }

  const { Items } = response;

  var updateQuery = {
    TableName: 'averages',
    UpdateExpression: "set temp = :temp and gravity = :gravity and datapoints = :datapoints",
    Item: {
      beer: doc.beer,
      timestamp: moreThenTimestamp,
      datapoints: response.Count,
      gravity: Items.reduce((p, c, i) => p + (c.gravity - p) / (i + 1), 0),
      temp: Items.reduce((p, c, i) => p + (c.temp - p) / (i + 1), 0),
    }
  }

  response = await db.put(updateQuery).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: response }),
  };
};
