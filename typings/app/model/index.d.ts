// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Bill from '../../../app/model/bill';
import Footprint from '../../../app/model/footprint';
import Message from '../../../app/model/message';
import Option from '../../../app/model/option';
import Pub from '../../../app/model/pub';
import PubReply from '../../../app/model/pubReply';
import Tag from '../../../app/model/tag';
import Task from '../../../app/model/task';
import Todo from '../../../app/model/todo';
import TodoRegular from '../../../app/model/todoRegular';
import Tomato from '../../../app/model/tomato';
import User from '../../../app/model/user';
import UserFriend from '../../../app/model/userFriend';
import Version from '../../../app/model/version';

declare module 'sequelize' {
  interface Sequelize {
    Bill: ReturnType<typeof Bill>;
    Footprint: ReturnType<typeof Footprint>;
    Message: ReturnType<typeof Message>;
    Option: ReturnType<typeof Option>;
    Pub: ReturnType<typeof Pub>;
    PubReply: ReturnType<typeof PubReply>;
    Tag: ReturnType<typeof Tag>;
    Task: ReturnType<typeof Task>;
    Todo: ReturnType<typeof Todo>;
    TodoRegular: ReturnType<typeof TodoRegular>;
    Tomato: ReturnType<typeof Tomato>;
    User: ReturnType<typeof User>;
    UserFriend: ReturnType<typeof UserFriend>;
    Version: ReturnType<typeof Version>;
  }
}
