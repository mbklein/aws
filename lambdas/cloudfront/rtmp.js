const wrapper = require('cfn-wrapper');
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

exports.wrapper = wrapper($worker = {
  create: (params) => {
    var cloudfront = new AWS.CloudFront();
    var template = {
      StreamingDistributionConfig: {
        CallerReference: uuid(),
        Comment: 'Avalon RTMP Streaming Config',
        Enabled: true,
        S3Origin: {
          DomainName: params.DerivativeBucket,
          OriginAccessIdentity: 'origin-access-identity/cloudfront/' + params.CloudFrontOAI
        },
        TrustedSigners: {
          Enabled: true,
          Quantity: 1,
          Items: [
            params.TrustedSigner,
          ]
        },
        Aliases: {
          Quantity: 1,
          Items: [
            params.CloudFrontRtmp,
          ]
        },
        Logging: {
          Bucket: 'STRING_VALUE',
          Enabled: false,
          Prefix: 'STRING_VALUE'
        },
        PriceClass: params.PriceClass
      }
    };
    cloudfront.createStreamingDistribution(template, (err, data) => {
      if (err) reply(err);
      else     reply(null, data.StreamingDistribution.Id, {"Arn": data.StreamingDistribution.ARN, "DomainName": data.DomainName} );
    });
  },
  update: (params, physicalResourceId) => {
    reply("Update not yet implemented");
  },
  delete: (params, physicalResourceId) => {
    reply("Delete not yet implemented");
  }
});
