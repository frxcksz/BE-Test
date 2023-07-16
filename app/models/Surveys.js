'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Surveys extends Model {}

  Surveys.init(
    {
      values: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Surveys',
      tableName: 'surveys',
      timestamps: false,
    }
  );

  Surveys.associate = (models) => {
    Surveys.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Surveys;
};
