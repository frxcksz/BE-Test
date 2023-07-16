'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attacks extends Model {}

  Attacks.init(
    {
      destinationCountry: {
        type: DataTypes.ARRAY(DataTypes.STRING(255)),
        allowNull: true,
      },
      sourceCountry: {
        type: DataTypes.ARRAY(DataTypes.STRING(255)),
        allowNull: true,
      },
      attackType: {
        type: DataTypes.ARRAY(DataTypes.STRING(255)),
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Attacks',
      tableName: 'attacks',
      timestamps: false,
    }
  );

  return Attacks;
};
