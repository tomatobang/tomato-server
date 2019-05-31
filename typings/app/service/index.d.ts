// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAsset from '../../../app/service/asset';
import ExportBase from '../../../app/service/base';
import ExportBill from '../../../app/service/bill';
import ExportFootprint from '../../../app/service/footprint';
import ExportMessage from '../../../app/service/message';
import ExportOptions from '../../../app/service/options';
import ExportTag from '../../../app/service/tag';
import ExportTask from '../../../app/service/task';
import ExportTodo from '../../../app/service/todo';
import ExportTodoRegular from '../../../app/service/todoRegular';
import ExportTomato from '../../../app/service/tomato';
import ExportUser from '../../../app/service/user';
import ExportUserFriend from '../../../app/service/userFriend';
import ExportVersion from '../../../app/service/version';

declare module 'egg' {
  interface IService {
    asset: ExportAsset;
    base: ExportBase;
    bill: ExportBill;
    footprint: ExportFootprint;
    message: ExportMessage;
    options: ExportOptions;
    tag: ExportTag;
    task: ExportTask;
    todo: ExportTodo;
    todoRegular: ExportTodoRegular;
    tomato: ExportTomato;
    user: ExportUser;
    userFriend: ExportUserFriend;
    version: ExportVersion;
  }
}
