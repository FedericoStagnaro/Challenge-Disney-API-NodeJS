const { Model , DataTypes } = require('sequelize')
const sequelize = require('../db')


class CharacterXMovie extends Model {}

CharacterXMovie.init({
    id_character: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        references: {
            model: 'Character',
            key: 'id'
        },
        validate: {
            isInt:{ msg: 'id_character must be an integer' },
            isExistentCharacter: async (id_character) => {
                const character_match = await sequelize.models.Character.findByPk(id_character, {attributes: ['id']})
                if (character_match === null) {
                    throw new Error(`Character with id ${id_character} not finded`) 
                }
            }
        }
    },
    id_movie: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        references: {
            model: 'Movie',
            key: 'id'
        },
        validate: {
            isInt:{ msg: 'id_movie must be an integer' },
            isExistentCharacter: async (id_movie) => {
                const movie_match = await sequelize.models.Movie.findByPk(id_movie,{ attributes: ['id'] })
                if (movie_match === null) {
                    throw new Error(`Movie with id ${id_movie} not finded`) 
                }
            }
        }
    }
},{
    sequelize,
    timestamps:false,
    tableName: 'CharactersXMovies',
    modelName: 'CharacterXMovie'
})

module.exports = CharacterXMovie