'use strict'
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const config = require("../config/db");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};


// define model example

// relation example
// relation between role and user
// db.role.hasMany(db.user, {
  //   as: "users",
//   onDelete: "cascade",
//   onUpdate: "cascade",
// });

// db.user.belongsTo(db.role, {
  //   foreignKey: "roleId",
//   as: "role",
// });

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;  