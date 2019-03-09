// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Asset from '../../../app/controller/asset';
import Base from '../../../app/controller/base';
import Bill from '../../../app/controller/bill';
import Footprint from '../../../app/controller/footprint';
import Home from '../../../app/controller/home';
import Message from '../../../app/controller/message';
import Options from '../../../app/controller/options';
import Other from '../../../app/controller/other';
import Task from '../../../app/controller/task';
import Todo from '../../../app/controller/todo';
import TodoRegular from '../../../app/controller/todoRegular';
import Tomato from '../../../app/controller/tomato';
import User from '../../../app/controller/user';
import UserFriend from '../../../app/controller/userFriend';
import Version from '../../../app/controller/version';

declare module 'egg' {
  interface IController {
    asset: Asset;
    base: Base;
    bill: Bill;
    footprint: Footprint;
    home: Home;
    message: Message;
    options: Options;
    other: Other;
    task: Task;
    todo: Todo;
    todoRegular: TodoRegular;
    tomato: Tomato;
    user: User;
    userFriend: UserFriend;
    version: Version;
  }
}
