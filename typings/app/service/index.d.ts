// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Base from '../../../app/service/base';
import Footprint from '../../../app/service/footprint';
import Message from '../../../app/service/message';
import Options from '../../../app/service/options';
import Task from '../../../app/service/task';
import Todo from '../../../app/service/todo';
import TodoRegular from '../../../app/service/todoRegular';
import Tomato from '../../../app/service/tomato';
import User from '../../../app/service/user';
import UserFriend from '../../../app/service/userFriend';
import Version from '../../../app/service/version';

declare module 'egg' {
  interface IService {
    base: Base;
    footprint: Footprint;
    message: Message;
    options: Options;
    task: Task;
    todo: Todo;
    todoRegular: TodoRegular;
    tomato: Tomato;
    user: User;
    userFriend: UserFriend;
    version: Version;
  }
}
