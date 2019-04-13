// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAsset = require('../../../app/model/asset');
import ExportBill = require('../../../app/model/bill');
import ExportFootprint = require('../../../app/model/footprint');
import ExportMessage = require('../../../app/model/message');
import ExportOption = require('../../../app/model/option');
import ExportPub = require('../../../app/model/pub');
import ExportPubReply = require('../../../app/model/pubReply');
import ExportTag = require('../../../app/model/tag');
import ExportTask = require('../../../app/model/task');
import ExportTodo = require('../../../app/model/todo');
import ExportTodoRegular = require('../../../app/model/todoRegular');
import ExportTomato = require('../../../app/model/tomato');
import ExportUser = require('../../../app/model/user');
import ExportUserFriend = require('../../../app/model/userFriend');
import ExportVersion = require('../../../app/model/version');

declare module 'egg' {
  interface IModel {
    Asset: ReturnType<typeof ExportAsset>;
    Bill: ReturnType<typeof ExportBill>;
    Footprint: ReturnType<typeof ExportFootprint>;
    Message: ReturnType<typeof ExportMessage>;
    Option: ReturnType<typeof ExportOption>;
    Pub: ReturnType<typeof ExportPub>;
    PubReply: ReturnType<typeof ExportPubReply>;
    Tag: ReturnType<typeof ExportTag>;
    Task: ReturnType<typeof ExportTask>;
    Todo: ReturnType<typeof ExportTodo>;
    TodoRegular: ReturnType<typeof ExportTodoRegular>;
    Tomato: ReturnType<typeof ExportTomato>;
    User: ReturnType<typeof ExportUser>;
    UserFriend: ReturnType<typeof ExportUserFriend>;
    Version: ReturnType<typeof ExportVersion>;
  }
}
