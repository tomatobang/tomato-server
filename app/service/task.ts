'use strict';

import BaseService from './base';
export default class TaskService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.Task;
  }

  /**
   * 更新语音路径
   * @param { Number } taskid 任务编号
   * @param { String } relateUrl 相对路径
   * @return { Boolean } 是否成功
   */
  async updateVoiceUrl(taskid, relateUrl) {
    const model = this.ctx.model.Task;
    await model.updateOne({ _id: taskid }, { voiceUrl: relateUrl }, {});
    return true;
  }
}
