const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')
const MovieGenre = require('./MovieGenre')

class Movie extends Model {}

Movie.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            notNull: {
                msg: 'Name cannot be null'
            }
        } 
    },
    releaseDate: {
        type: DataTypes.DATE,
        get (){
            const value = this.getDataValue('releaseDate')
            return  value.toISOString().slice(0,10)
        }
    },
    qualification: {
        type: DataTypes.INTEGER,
        validate: {
            isInt: { msg: 'Qualification must be an integer' },
            isFromOneToFive:(value) => {
                if ( !(1 <= value && value  <= 5)  ){ 
                    throw new Error('Qualification must be from 1 to 5')
                }}
        }
    },
    genre_id:{
        type:DataTypes.INTEGER,
        references: {
            model: sequelize.models.MovieGenre,
            key: 'id'
        },
        validate: {
            isInt: { msg: 'Genre_id must be an integer' },
            genre_idExistent:  async (genre_id) => {
                const match = await MovieGenre.findByPk(genre_id)
                if ( match === null ) {
                    throw new Error('Cannot find that genre id')
                }
            }
        }
    },
    image:{
        type: DataTypes.STRING
    } 
},{
    sequelize,
    timestamps: false,
    tableName: 'Movies',
    modelName: 'Movie'
})

module.exports = Movie