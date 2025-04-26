const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.PORT,
  operatorsAliases: false,
  pool: dbConfig.pool,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.landmark = require("./landmark.model.js")(sequelize, DataTypes);
db.visited = require("./visited.model.js")(sequelize, DataTypes);

// Associations
db.landmark.hasMany(db.visited, { foreignKey: "landmark_id" });
db.visited.belongsTo(db.landmark, { foreignKey: "landmark_id" });

module.exports = db;
