 # 指定我们的基础镜像是node，版本是v8.0.0
 FROM node:alpine
 # 指定制作我们的镜像的联系人信息（镜像创建者）
 LABEL name="pengyi" 

 # 添加一个非 root 用户
 RUN groupadd -r nodejs \
   && useradd -m -r -g nodejs nodejs
 USER nodejs

 RUN mkdir -p /usr/src/tomatobang
 
 # 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的app文件夹下
 ADD . /usr/src/tomatobang
 # cd到app文件夹下
 WORKDIR /usr/src/tomatobang
 
 # 安装项目依赖包
 RUN npm install

 # 配置环境变量
 ENV PORT 7001
 
 # 容器对外暴露的端口号
 EXPOSE 7001
 
 # 容器启动时执行的命令，类似npm run start
 CMD ["npm", "start"]