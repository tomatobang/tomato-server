declare module 'egg' {
  // 扩展 app
  interface Application {
    redis: any;
    mongoose:any;
    validator: any;
    util: any;
  }
}
