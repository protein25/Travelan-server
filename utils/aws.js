const Promise = require('bluebird');
const AWS = require('aws-sdk');
const fs = require('fs');
const moment = require('moment');
const url = require('url');

AWS.config.update({
  accessKeyId: 'AKIAIMKFMG34BNH42VVA',
  secretAccessKey: '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',
  region: 'ap-northeast-2',
});

const s3 = new AWS.S3();

module.exports = {
  s3Upload(file) {
    const { originalname, buffer, mimetype } = file;
    const Key = `${moment().valueOf()}_${originalname}`;
    const param = {
        Bucket: 'travelan-images',
        Key,
        ACL: 'public-read',
        Body: buffer,
        ContentType: mimetype,
    };

    return new Promise((resolve, reject) => {
      s3.upload(param, function(err, data){
          if (err) {
            reject(err);
            return;
          }

          const location = url.parse(data.Location);
          const serverName = `${location.protocol}//${location.host}`;
          const originName = location.path;

          resolve({
            serverName,
            originName,
          });
      });
    });
  },
}
