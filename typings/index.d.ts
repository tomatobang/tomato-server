import { RedisChatService, RedisTomatoService } from '../app/util/redis';
import tokenService from '../app/util/jwt';

declare module 'egg' {
  interface Application {
    io:any;
    redis: any;
    mongoose: any;
    validator: any;
    util: {
      redis: {
        redisChatService: RedisChatService;
        redisTomatoService: RedisTomatoService;
      };
      push: {
        JPUSH:{
          pushMessage(alias, alert, title): any;
        }
      };
      jwt: {
        tokenService: {
          createToken(userinfo): any;
          verifyToken(token): any;
          expiresIn;
        };
      };
    };
  }
}
