 FROM node:alpine
 LABEL name="pengyi" 

#  RUN groupadd -r tomatobang \
#    && useradd -m -r -g tomatobang tomatobang
#  USER tomatobang

 RUN mkdir -p /usr/src/tomatobang
 
 ADD . /usr/src/tomatobang
 WORKDIR /usr/src/tomatobang
 
 RUN npm install

 ENV PORT 7001
 
 EXPOSE 7001
 
 CMD ["npm", "dev"]