const wrapper = require('cfn-wrapper');
const AWS = require('aws-sdk');

exports.handler = wrapper($worker = {
  create: (params) => {
    var lambda = new AWS.Lambda();
    lambda.updateFunctionConfiguration({ FunctionName: params.FunctionName, Environment: params.Environment }, (err, data) => {
      if (err) reply(err)
      else     reply(null, params.FunctionName+':environment', { ServiceToken: params.FunctionName });
    });
  },
  update: (params, physicalResourceId) => {
    reply("Update not implemented");
  },
  delete: (params, physicalResourceId) => {
    reply("Delete not implemented");
  }
});
