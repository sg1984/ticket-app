"use strict";
var bCrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
    },
    {}
  );

  User.rolesOptions = ["ADMIN", "MANAGER", "USER"];

  return User;
};
