const wrapper = require('cfn-wrapper');
const AWS = require('aws-sdk');
exports.wrapper = wrapper($worker = {
  create: (params) => {
    var cloudfront = new AWS.CloudFront();
    var template = {
      CloudFrontOriginAccessIdentityConfig: {
        CallerReference: Math.random().toString(36).substring(7),
        Comment: 'Avalon Origin Access Identity'
      }
    };
    cloudfront.createCloudFrontOriginAccessIdentity(template, (err, data) => {
      if (err) reply(err)
      else     reply(null, data.CloudFrontOriginAccessIdentity.Id, { "S3CanonicalUserId": data.S3CanonicalUserId });
    });
  },
  update: (params, physicalResourceId) => {
    reply("Update not yet implemented");
  },
  delete: (params, physicalResourceId) => {
    var cloudfront = new AWS.CloudFront();
    cloudfront.getCloudFrontOriginAccessIdentity({ Id: physicalResourceId }, (err, data) => {
       if (err) reply(err);
       else cloudfront.deleteCloudFrontOriginAccessIdentity({ Id: physicalResourceId, IfMatch: data.ETag }, function(err, data) {
         reply(err, physicalResourceId, {});
       });
     });
  }
});
