declare module 'egg' {
  // 扩展 app
  interface Application {
    redis: any;
    validator: any;
    util: any;
  }
}
