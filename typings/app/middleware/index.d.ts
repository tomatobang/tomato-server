// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportErrorhandler from '../../../app/middleware/errorhandler';
import ExportJwt from '../../../app/middleware/jwt';
import ExportRatelimit from '../../../app/middleware/ratelimit';
import ExportRobot from '../../../app/middleware/robot';

declare module 'egg' {
  interface IMiddleware {
    errorhandler: typeof ExportErrorhandler;
    jwt: typeof ExportJwt;
    ratelimit: typeof ExportRatelimit;
    robot: typeof ExportRobot;
  }
}
