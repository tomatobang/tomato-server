// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Message from '../../../app/model/message';
import Option from '../../../app/model/option';
import Pub from '../../../app/model/pub';
import PubReply from '../../../app/model/pubReply';
import Task from '../../../app/model/task';
import Tomato from '../../../app/model/tomato';
import User from '../../../app/model/user';
import UserFriend from '../../../app/model/userFriend';
import Version from '../../../app/model/version';

declare module 'sequelize' {
  interface Sequelize {
    Message: ReturnType<typeof Message>;
    Option: ReturnType<typeof Option>;
    Pub: ReturnType<typeof Pub>;
    PubReply: ReturnType<typeof PubReply>;
    Task: ReturnType<typeof Task>;
    Tomato: ReturnType<typeof Tomato>;
    User: ReturnType<typeof User>;
    UserFriend: ReturnType<typeof UserFriend>;
    Version: ReturnType<typeof Version>;
  }
}
