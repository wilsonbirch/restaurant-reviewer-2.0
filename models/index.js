'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const { brotliDecompress } = require('zlib')
const basename = path.basename(__filename)
const db = {}

let sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
    }
)

fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
        )
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        )
        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

//Models/tables
db.users = require('../models/user')(sequelize, Sequelize)
db.restaurant = require('../models/restaurant')(sequelize, Sequelize)

//Relations
db.restaurant.belongsTo(db.users)
db.users.hasMany(db.restaurant)

module.exports = db
