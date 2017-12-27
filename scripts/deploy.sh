#! /usr/bin/env bash

# Only deply on master branch
SOURCE_BRANCH="master"
echo "branch: $TRAVIS_BRANCH, ispullrequest: $TRAVIS_PULL_REQUEST, eventtype: $TRAVIS_EVENT_TYPE"

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" -o "$TRAVIS_EVENT_TYPE" = "cron" ]; then
  echo "Skip deploy, TRAVIS_PULL_REQUEST=$TRAVIS_PULL_REQUEST, TRAVIS_BRANCH=$TRAVIS_BRANCH"
  exit 0
fi

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
echo "key: $ENCRYPTED_KEY, iv: $ENCRYPTED_IV"
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in scripts/id_rsa.enc -out ~/.ssh/id_rsa -d
chmod 600 ~/.ssh/id_rsa
echo -e "Host 47.100.16.77\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config

# 删除 CI 环境下无关文件
npm run clean
rm -rf node_modules
tar -czf tomatobang-server.tar.gz *
# 拷贝文件至服务器
scp tomatobang-server.tar.gz tomatobang@47.100.16.77:/usr/
ssh root@47.100.16.77 'cd /usr/ && rm -rf tomatobang-server'
ssh root@47.100.16.77 'mkdir -p tomatobang-server && tar -xzvf tomatobang-server.tar.gz -C tomatobang-server'
# 覆盖默认配置文件
ssh root@47.100.16.77 'cp config.default.js /usr/tomatobang-server/config/config.default.js'
ssh root@47.100.16.77 'cd /usr/tomatobang-server && npm i --production'
# 关闭实例并重启
ssh root@47.100.16.77 'cd /usr/tomatobang-server && egg-scripts stop'
ssh root@47.100.16.77 'cd /usr/tomatobang-server && egg-scripts start --port=8888 --daemon --env=prod --title=${appname}-server'