let User = require("./user");

// Creating our Store model
module.exports = function(sequelize, DataTypes) {
  const Restaurant = sequelize.define("Restaurant", {
    // The name of the restaurant will be a string and must be unique and not empty
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
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
    favorite: {
      type: DataTypes.BOOLEAN,
      default: 0
    },
    review: {
      type: DataTypes.STRING
    }
  });
  
  return Restaurant;
};
