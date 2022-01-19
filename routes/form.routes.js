const controller = require("../controllers/form.controller")

module.exports = (app) => {
  app.get("/", controller.home);
  
  app.get("/api/form/:id", controller.getForm)
  
  app.get("/api/result/:id", controller.getResult)
  
  app.post("/api/form/create", controller.createForm)
  
  app.post("/api/result/create", controller.createResult)
}

