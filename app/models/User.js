'use strict'
const { Model } = require('sequelize');

const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      digits: {
        type: DataTypes.STRING(155),
        allowNull: true,
        unique: true,
      },
      fotoUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      workType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      positionTitle: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lon: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING(155),
        allowNull: true,
      },
      isLogin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      dovote: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      dosurvey: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      dofeedback: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      fullname: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cuurentLeave: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
}