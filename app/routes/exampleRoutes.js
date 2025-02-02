const { exampleMiddleware } = require("../middleware");
const exampleController = require("../controllers/exampleController");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const router = require("express").Router();

  router.get("/", exampleController.getData);
  router.get("/refactorme1", exampleController.refactoreMe1);
  router.post("/refactorme2", exampleController.refactoreMe2);
  router.get("/callmewss", exampleController.callmeWebSocket);

  router.get("/protected", [exampleMiddleware.authenticateJWT, exampleMiddleware.checkUserRole("admin")], exampleController.protectedFunction);

  app.use("/api/data", router);
};
