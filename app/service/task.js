module.exports = app => {
    class TaskService extends app.Service {
      async list() {
        
        return [];
      }
    }
    return TaskService;
  };