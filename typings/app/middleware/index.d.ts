// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Errorhandler from '../../../app/middleware/errorhandler';
import Jwt from '../../../app/middleware/jwt';
import Ratelimit from '../../../app/middleware/ratelimit';
import Robot from '../../../app/middleware/robot';

declare module 'egg' {
  interface IMiddleware {
    errorhandler: typeof Errorhandler;
    jwt: typeof Jwt;
    ratelimit: typeof Ratelimit;
    robot: typeof Robot;
  }
}
