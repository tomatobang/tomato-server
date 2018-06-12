// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Base from '../../../app/controller/base';
import Home from '../../../app/controller/home';
import Message from '../../../app/controller/message';
import Options from '../../../app/controller/options';
import Other from '../../../app/controller/other';
import Task from '../../../app/controller/task';
import Tomato from '../../../app/controller/tomato';
import User from '../../../app/controller/user';
import UserFriend from '../../../app/controller/userFriend';
import Version from '../../../app/controller/version';

declare module 'egg' {
  interface IController {
    base: Base;
    home: Home;
    message: Message;
    options: Options;
    other: Other;
    task: Task;
    tomato: Tomato;
    user: User;
    userFriend: UserFriend;
    version: Version;
  }
}
