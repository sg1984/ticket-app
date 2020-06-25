"use strict";
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "task",
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      status: DataTypes.STRING,
      groupId: DataTypes.INTEGER,
      responsibileId: DataTypes.INTEGER,
    },
    {}
  );
  return Task;
};
