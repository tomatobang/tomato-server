'use strict';

module.exports = {
  /**
   * QiNiu Singleton instance
   * @member Context#qiniu
   * @since 1.0.0
   * @see App#qiniu
   */
  get qiniu() {
    return this.app.qiniu;
  },
};
