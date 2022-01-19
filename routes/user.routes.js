const controller = require("../controllers/user.controller")

module.exports = (app) => {
  
  app.post("/api/user/signup", controller.signup)

  app.post("/api/user/signin", controller.signin)

  app.get("/api/user/list", controller.list)

}