'use strict';
/**
 * 服务基类
 */
const Service = require('egg').Service;

class BaseService extends Service {

  /**
   * 创建
   * @param { Object } body 实体对象
   * @return { Object } 查询结果
   */
  async create(body) {
    const model = this.model;
    const result = await model.create(body);
    return result;
  }

   /**
   * 根据 ID 进行查找
   * @param { Object } query 查询关键字
   * @param { Object } conditions 查询条件
   * @return { Object } 查询结果
   */
  async findAll(query, conditions) {
    const model = this.model;
    if (conditions) {
        if (!conditions.deleted) {
            conditions.deleted = false;
        }
    }
    let builder = model.find(conditions);
    if (query.select) {
        const select = JSON.parse(query.select);
        builder = builder.select(select);
    }

    [ 'limit', 'skip', 'sort', 'count' ].forEach(key => {
        if (query[key]) {
            let arg = query[key];
            if (key === 'limit' || key === 'skip') {
                arg = parseInt(arg);
            }
            if (key === 'sort' && typeof arg === 'string') {
                arg = JSON.parse(arg);
            }
            if (key !== 'count') builder[key](arg);
            else builder[key]();
        }
    });
    const result = await builder.exec();
    return result;
}

  /**
   * 根据 ID 进行查找
   * @param { Object } query 查询关键字
   * @param { Number } id 编号
   * @return { Object } 查询结果
   */
  async findById(query, id) {
    const model = this.model;
    let select = {};
    let builder = model.findById(id);
    if (query.select) {
      select = JSON.parse(query.select);
      builder = builder.select(select);
    }
    const result = await builder.exec();
    return result;
  }

  /**
   * 根据 id 进行更新
   * @param { Number } id 编号
   * @param { Object } body 实体对象
   * @return { Object } 查询结果
   */
  async updateById(id, body) {
    const model = this.model;
    const result = await model
      .findByIdAndUpdate(id, body, {
        new: true,
      })
      .exec();
    return result;
  }

  /**
   * 根据 ID 替换
   * @param { Number } id 编号
   * @param { Object } newDocument 新记录
   * @return { Object } 查询结果
   */
  async replaceById(id, newDocument) {
    const model = this.model;
    await model.findByIdAndRemove(id).exec();
    const result = await model.create(newDocument);
    return result;
  }

  /**
   * 删除记录
   * @param { Number } id 编号
   * @return { Object } 查询结果
   */
  async delete(id) {
    const model = this.model;
    await model.updateOne({ _id: id }, { deleted: true }, {});
    return true;
  }

  /**
   * 物理级别抹除
   * @param { Number } id 编号
   * @return { Object } 查询结果
   */
  async erase(id) {
    const model = this.model;
    await model.findByIdAndRemove(id).exec();
    return true;
  }
}

module.exports = BaseService;
