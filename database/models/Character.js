const { Model , DataTypes } = require('sequelize')
const CharactersXMovies = require('./CharacterXMovie')
const sequelize = require('../db')


class Character extends Model {}

Character.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            notNull: { msg: 'Name cannot be null' }
        }
    },
    age:{
        type: DataTypes.INTEGER,
        validate: {
            isInt: { msg : 'Age must be an integer' }
        }

    },
    weight:{
        type: DataTypes.FLOAT,
        validate: {
            isFloat: { msg : 'Weight must be a float' }
        }
    },
    history:{
        type: DataTypes.TEXT
    },
    image:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    sequelize,
    timestamps:false,
    tableName: 'Characters',
    modelName: 'Character',
    initialAutoIncrement: '1000'
})

Character.addHook('afterDestroy',async (character, options) => {
    await CharactersXMovies.destroy({ where: { id_character: character.id }, transaction: options.t })
})

module.exports = Character