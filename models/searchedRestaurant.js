// Creating our Restaurant model
module.exports = function(sequelize, DataTypes) {
  const searchedRestaurants = sequelize.define("searchedRestaurants", {
    // The name of the restaurant will be a string and must be unique and not empty
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // The restaurant description will be able to be read and updated
    cuisine: {
      type: DataTypes.STRING,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING
    },
    restId: {
      type: DataTypes.STRING
    }
  });

  return searchedRestaurants;
};
