module.exports = app => {
    class TomatoService extends app.Service {
      async list() {
        
        return [];
      }
    }
    return TomatoService;
  };