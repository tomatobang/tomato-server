'use strict';

const qiniu = require('qiniu'),
  _ = require('lodash');
let mac;
let policyOptions;
let putPolicy;
let uploadToken;
let raw_config;

exports.config = function(config) {
  raw_config = config;
  _.assign(qiniu.conf, raw_config);
  config.zone = qiniu.zone.Zone_z2;
  // 创建鉴权对象
  mac = qiniu.auth.digest.Mac(raw_config.ACCESS_KEY, raw_config.SECRET_KEY);
  policyOptions = {
    scope: raw_config.scope,
    expires: raw_config.expires,
  };
  putPolicy = new qiniu.rs.PutPolicy(policyOptions);
  uploadToken = putPolicy.uploadToken(mac);
};

// 文件上传
exports.putFile = async function(key, localFile) {
  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2; // huanan
  const putExtra = new qiniu.form_up.PutExtra();
  const tt = new qiniu.form_up.FormUploader(config);
  const pro = new Promise((resolve, reject) => {
    tt.putFile(uploadToken, key, localFile, putExtra, function(
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        reject(respErr);
      }
      if (respInfo.statusCode === 200) {
        resolve(respBody);
      } else {
        console.log(respInfo.statusCode);
        resolve(respBody);
      }
    });
  });
  return pro;
};

exports.test = function() {
  return 'just for test!';
};
