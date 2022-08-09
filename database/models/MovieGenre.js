const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class MovieGenre extends Model {}

MovieGenre.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    }
},{
    sequelize,
    timestamps: false,
    tableName: 'MovieGenres',
    modelName: 'MovieGenre',
    initialAutoIncrement: 1
})


module.exports = MovieGenre
