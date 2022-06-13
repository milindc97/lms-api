const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/user/all",controller.getAllUsers);
  app.post("/api/user/status",controller.getAllUsersByStatus);
  app.put("/api/user/update/:id",[authJwt.verifyToken],controller.updateUser);
  app.get("/api/user/:id",[authJwt.verifyToken],controller.singleUser);
  app.get("/api/userbirthday",[authJwt.verifyToken],controller.birthdaysonweek);
  app.put("/api/user/change-password/:id",[authJwt.verifyToken],controller.changeUserPassword);
  app.put("/api/user/update/status/:id",[authJwt.verifyToken, authJwt.isAdmin],controller.updateStatusUser);
  app.get("/api/user/emp/count",[authJwt.verifyToken, authJwt.isAdmin],controller.getTotalEmployeeCount);
};