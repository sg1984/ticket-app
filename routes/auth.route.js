const authController = require("../controllers/auth.controller.js");
const { auth } = require("../config/login_config");

module.exports = function (app, passport) {
  app.get("/logout", authController.logout);

  app.get("/signin", authController.signin);
  app.post(
    "/signin",
    passport.authenticate("local-signin", {
      session: false,
    }),
    function (req, res) {
      res.send(req.user);
    }
  );

  app.get("/test-logged", auth.required, (req, res) => res.send("OK"));
};
