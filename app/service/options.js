module.exports = app => {
    class OptionsService extends app.Service {
      async list() {
        
        return [];
      }
    }
    return OptionsService;
  };