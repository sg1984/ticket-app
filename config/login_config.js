const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const secret = "ticket-app-2020";

const generateJWT = (user) => {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setMinutes(today.getMinutes() + 60);

  return jwt.sign(
    {
      email: user.email,
      id: user.id,
      role: user.role,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    secret
  );
};

const toAuthJSON = (user) => {
  return {
    token: generateJWT(user),
  };
};

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(" ")[0] === "Bearer") {
    return authorization.split(" ")[1];
  }
  return null;
};

const auth = {
  required: expressJwt({
    secret: secret,
    userProperty: "payload",
    getToken: getTokenFromHeaders,
  }),
  optional: expressJwt({
    secret: secret,
    userProperty: "payload",
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = {
  toAuthJSON,
  secret,
  auth,
};
