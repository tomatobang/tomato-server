 FROM node:alpine
 LABEL name="pengyi" 

 RUN groupadd -r tomatobang \
   && useradd -m -r -g tomatobang tomatobang
 USER tomatobang

 RUN mkdir -p /usr/src/tomatobang
 
 ADD . /usr/src/tomatobang
 WORKDIR /usr/src/tomatobang
 
 RUN npm install --registry=https://registry.npm.taobao.org

 ENV PORT 7002
 
 EXPOSE 7002
 
 CMD ["bin/sh"]