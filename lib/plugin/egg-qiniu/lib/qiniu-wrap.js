'use strict';

const qiniu = require('qiniu');
const _ = require('lodash');
const promisify = require('util').promisify;

let mac;
let policyOptions;
let putPolicy;
let uploadToken;

/**
 * 初始化配置
 * @param {*} config 配置
 */
exports.config = function(config) {
  _.assign(qiniu.conf, config);
  config.zone = qiniu.zone.Zone_z2;
  // 创建鉴权对象
  mac = qiniu.auth.digest.Mac(config.ACCESS_KEY, config.SECRET_KEY);
  policyOptions = {
    scope: config.scope,
    expires: config.expires,
    insertOnly: config.insertOnly,
  };
  putPolicy = new qiniu.rs.PutPolicy(policyOptions);
  uploadToken = putPolicy.uploadToken(mac);
};

/**
 * 获取上传凭证
 * @return { String } uploadToken
 */
exports.getuploadToken = async function() {
  return uploadToken;
};

/**
 * 刷新凭证
 */
exports.refreshUploadToken = async function() {
  // TODO
};

/**
 * 文件上传
 * @param {*} key 键值
 * @param {*} localFile 文件路径
 * @return { Promise } pro
 */
exports.putFile = async function(key, localFile) {
  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2; // huanan
  const putExtra = new qiniu.form_up.PutExtra();
  const tt = new qiniu.form_up.FormUploader(config);
  const pro = new Promise((resolve, reject) => {
    tt.putFile(
      uploadToken,
      key,
      localFile,
      putExtra,
      (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(respErr);
        }
        if (respInfo.statusCode === 200) {
          resolve(respBody);
        } else {
          console.log(respInfo.statusCode);
          resolve(respBody);
        }
      }
    );
  });
  return pro;
};

/**
 * 文件流上传
 * @param {*} key 键值
 * @param {*} rsStream 文件流
 * @return { Promise } stat
 */
exports.putStream = async function(key, rsStream) {
  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2; // huanan
  const putExtra = new qiniu.form_up.PutExtra();
  const tt = new qiniu.form_up.FormUploader(config);
  const prf = promisify(tt.putStream);
  return prf(uploadToken, key, rsStream, putExtra);
};

/**
 * 公开空间访问链接
 * @param { String } key 键值
 * @param { String } publicBucketDomain 域名
 * @return { String } publicDownloadUrl
 */
exports.publicDownloadUrl = async function(key, publicBucketDomain) {
  const config = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  const publicDownloadUrl = bucketManager.publicDownloadUrl(
    publicBucketDomain,
    key
  );
  return publicDownloadUrl;
};

/**
 * 私有空间访问链接
 * @param { String } key 键值
 * @param { Number } deadline 毫秒数,1小时过期: parseInt(Date.now() / 1000) + 3600
 * @param { String } privateBucketDomain 域名
 * @return { String } publicDownloadUrl
 */
exports.privateDownloadUrl = async function(
  key,
  deadline,
  privateBucketDomain
) {
  const config = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  const privateDownloadUrl = bucketManager.privateDownloadUrl(
    privateBucketDomain,
    key,
    deadline
  );
  return privateDownloadUrl;
};
