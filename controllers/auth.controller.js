const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");
var exports = (module.exports = {});

exports.signin = function (req, res) {
  res.status(jsonMessages.user.invalid.status).send(jsonMessages.user.invalid);
};

exports.logout = function (req, res, err) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res
        .status(jsonMessages.user.logoutError.status)
        .send(jsonMessages.user.logoutError);
    }
    res
      .status(jsonMessages.user.logoutSuccess.status)
      .send(jsonMessages.user.logoutSuccess);
  });
};
