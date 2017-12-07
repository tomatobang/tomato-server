const Service = require('egg').Service;

class TaskService extends Service {

  async findAll(query, conditions) {
    let model = this.ctx.model.Task;
    if (conditions) {
      if (!conditions.deleted) {
        conditions.deleted = false;
      }
    }
    let builder = model.find(conditions);
    if (query.select) {
      select = JSON.parse(query.select);
      builder = builder.select(select);
    }

    ["limit", "skip", "sort", "count"].forEach(key => {
      if (query[key]) {
        let arg = query[key];
        if (key === "limit" || key === "skip") {
          arg = parseInt(arg);
        }
        if (key === "sort" && typeof arg === "string") {
          arg = JSON.parse(arg);
        }
        if (key !== "count") builder[key](arg);
        else builder[key]();
      }
    });
    const result = await builder.exec();
    return result;
  }

  async findById(query, id) {
    let model = this.ctx.model.Task;
    let select = {};
    let builder = model.findById(id);
    if (query.select) {
      select = JSON.parse(query.select);
      builder = builder.select(select);
    }
    const result = await builder.exec();
    return result;
  }

  async create(body) {
    let model = this.ctx.model.Task;
    const result = await model.create(body);
    return result;
  }

  async delete(id) {
    let model = this.ctx.model.Task;
    await model.updateOne({ _id: id }, { deleted: true }, {});
    return true;
  }

  async erase(id) {
    let model = this.ctx.model.Task;
    await model.findByIdAndRemove(id).exec();
    return true;
  }


  async updateById(id, body) {
    let model = this.ctx.model.Task;
    const result = await model
      .findByIdAndUpdate(id, body, {
        new: true
      })
      .exec();
    return result;
  }

  async updateById(id, body) {
    let model = this.ctx.model.Task;
    const result = await model
      .findByIdAndUpdate(id, body, {
        new: true
      })
      .exec();
    return result;
  }


  async updateVoiceUrl(taskid, relateUrl) {
    let model = this.ctx.model.Task;
    await model.updateOne({ _id: taskid }, { voiceUrl: relateUrl }, {});
    return true;
  }

  async replaceById(id, newDocument) {
    let model = this.ctx.model.Task;
    await model.findByIdAndRemove(id).exec();
    const result = await model.create(newDocument);
    return result;
  }
}
module.exports = TaskService;