const controller = require("../controllers/consolidate.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/consolidate/question-bank/:id",controller.getQuestionBank);
  app.get("/api/consolidate/module/:id",controller.getModules);
  app.get("/api/consolidate/course/:id",controller.getCourses);
  app.get("/api/consolidate/program/:id",controller.getPrograms);
  app.get("/api/consolidate/program1/:id",controller.getPrograms1);
};
