"use strict";
const connect = require("../config/connectMySQL");

module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define(
    "group",
    {
      name: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {}
  );

  return group;
};
