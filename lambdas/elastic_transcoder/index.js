var wrapper = require('cfn-wrapper');
var AWS = require('aws-sdk');

exports.handler = wrapper({
  init: (context) => {
    AWS.config.region = context.invokedFunctionArn.match(/^arn:aws:lambda:(\w+-\w+-\d+):/)[1];
    this.elastictranscoder = new AWS.ElasticTranscoder();
  },
  create: (params) => {
    this.elastictranscoder.createPipeline(params, function(err, data) {
      if (err) {
        console.error(err);
        reply(err);
      } else  {
        reply(null, data.Pipeline.Id, { "Arn": data.Pipeline.Arn, "Id": data.Pipeline.Id });
      }
    });
  },
  update: (params, physicalResourceId) => {
    params.Id = physicalResourceId;
    delete params.OutputBucket;
    this.elastictranscoder.updatePipeline(params, function(err, data) {
      if (err) {
        console.error(err);
        reply(err);
      } else {
        reply(null, data.Pipeline.Id, { "Arn": data.Pipeline.Arn, "Id": data.Pipeline.Id });
      }
    });
  },
  delete: (params, physicalResourceId) => {
    this.elastictranscoder.deletePipeline({ Id: physicalResourceId }, function(err, data) {
      if (err) console.error(err);
      reply(err, physicalResourceId, {});
    });
  }
});
