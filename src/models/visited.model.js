module.exports = (sequelize, DataTypes) => {
  const Visited = sequelize.define("visited", {
    visitor_name: {
      type: DataTypes.STRING,
    },
    visited_date: {
      type: DataTypes.DATE,
    },
    note: {
      type: DataTypes.STRING,
    },
  });

  return Visited;
};
