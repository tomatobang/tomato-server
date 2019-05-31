// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAsset from '../../../app/controller/asset';
import ExportBase from '../../../app/controller/base';
import ExportBill from '../../../app/controller/bill';
import ExportFootprint from '../../../app/controller/footprint';
import ExportHome from '../../../app/controller/home';
import ExportMessage from '../../../app/controller/message';
import ExportOptions from '../../../app/controller/options';
import ExportOther from '../../../app/controller/other';
import ExportTag from '../../../app/controller/tag';
import ExportTask from '../../../app/controller/task';
import ExportTodo from '../../../app/controller/todo';
import ExportTodoRegular from '../../../app/controller/todoRegular';
import ExportTomato from '../../../app/controller/tomato';
import ExportUser from '../../../app/controller/user';
import ExportUserFriend from '../../../app/controller/userFriend';
import ExportVersion from '../../../app/controller/version';

declare module 'egg' {
  interface IController {
    asset: ExportAsset;
    base: ExportBase;
    bill: ExportBill;
    footprint: ExportFootprint;
    home: ExportHome;
    message: ExportMessage;
    options: ExportOptions;
    other: ExportOther;
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
