const CharacterXMovie = require('./models/CharacterXMovie')
const Character = require('./models/Character')
const MovieGenre = require('./models/MovieGenre')
const Movie = require('./models/Movie')
const sequelize = require('./db')

//const User = require('./models/User')

MovieGenre.hasMany(Movie,{
    sourceKey: 'id',
    foreignKey: 'genre_id'
})

// Añade la FK genero_id a la tabla pelicula
Movie.belongsTo(MovieGenre, { 
    targetKey: 'id',
    foreignKey: 'genre_id'
})

Character.belongsToMany(Movie, { 
    through: CharacterXMovie,
    foreignKey: 'id_character',
    otherKey: 'id_movie'
})
Movie.belongsToMany(Character, { 
    through: CharacterXMovie,
    foreignKey: 'id_movie',
    otherKey: 'id_character'
})

const syncDB = async() => {
    await sequelize.sync()
}
syncDB()