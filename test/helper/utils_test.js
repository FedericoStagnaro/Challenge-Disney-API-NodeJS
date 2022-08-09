const User = require('../../database/models/User')
// const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const sequelize = require('../../database/db')

const CharacterXMovie = require('../../database/models/CharacterXMovie')
const Character = require('../../database/models/Character')
const MovieGenre = require('../../database/models/MovieGenre')
const Movie = require('../../database/models/Movie')
const seed = require('./semilla_module')
const uuid = require('uuid') 


const correct_user = {
    name: 'nombreUsuario',
    username: 'usuario1',
    password: 'PASSwordU1...',
    email: 'u1@gmail.com',
    role: 'admin'
}

const uploadOneUser = async () => {
    return await User.create(correct_user)
}

const correct_credentials = {
    username: correct_user.username,
    password: correct_user.password
}
// ============== Character input =============
const character_correct = {
    name: 'Sullivan',
    age: 30,
    weight: 500,
    history: 'Lorem Ipsunm',
    movies: '[]' 
}
const character_missing_data = {}
const character_invalid_fields = {
    name: 123456,
    age: 'Holamundo',
    weight: 'holamundo',
    history: 'Lorem Ipsunm',
    movies: '[]'
}
const character_movies_id_nonExistent = {
    name: 'Sullivan',
    age: 30,
    weight: 500,
    history: 'Lorem Ipsunm',
    movies: '[99999,88888,77777]'
}

// ============== Movie input =============
const movie_correct = {
    name: 'MovieName',
    releaseDate: '2022-07-26',
    qualification: 4,
    genre_id: 1
}
const movie_invalid = {
    releaseDate: 'en mayo',
    qualification: 'cuatro estrellas',
    genre_id: 'de primera'
}

// ================= Genre ==================
const genre_correct = {
    name: 'Fantasia'
}

// ============== Image input =============
const image_correct_path = path.join(__dirname, '../helper/characters', 'sullivan.jpg') // relative from test_file.js
const image_invalid_path = path.join(__dirname, '../helper/', 'fileEmpty.txt')  // relative from test_file.js



const deletePublicDirContent = () => {
    const directory = path.join(__dirname, '../../public')
    const files = fs.readdirSync(directory)
    
    for (const file of files) {
        fs.unlinkSync(path.join(directory, file))
    } 
}

const getCountOfUsers = async () => {
    return await User.count({})
}

const cleanDB = async () => {
    await sequelize.drop()
    await sequelize.sync()
    await deletePublicDirContent()
}

const cleanCharactersMoviesImages = async () => {
    
    await cleanCharacters(),
    await cleanMovies(),
    await cleanCharactersXMovies(),
    await deletePublicDirContent()
    
}
const cleanUser = async () => {
    await User.drop()
    await User.sync()
}

const cleanMovies = async () => {
    await Movie.drop()
    await Movie.sync()
}

const cleanCharacters = async () => {
    await Character.drop()
    await Character.sync()
}

const cleanCharactersXMovies = async () => {
    await CharacterXMovie.drop()
    await CharacterXMovie.sync()
}


const fillDB = async () => {
    await uploadMovies()
    await uploadCharacters()
}

const uploadMovies = async () => {
    await uploadGenres()
    return await Movie.bulkCreate(seed.movies_full)
}
const uploadCharacters = async () => {
    return await Character.bulkCreate(seed.characters_full)
}


const uploadOneMovie = async (index) => {
    await MovieGenre.bulkCreate(seed.genres_full)
    return await Movie.create(seed.movies_full[index])
}
const uploadOneMovieWithCharacters = async (index)=>{
    await uploadGenres()
    await Movie.create({...seed.movies_full_with_characters[index]})
}

const uploadOneMovieWithImage = async (index) => {
    await uploadGenres()
    const imageName = await uploadOneImage(index)
    return await Movie.create({...seed.movies_full[index] , image:imageName})
}

const uploadOneCharacter = async (index) => {
    const character = await  Character.create( seed.characters_full[index])
    return character
}
const uploadOneCharacterWithImage = async (index) => {
    const character = await uploadOneCharacter(index)
    const image = await uploadOneImage(index)
    await character.update({image:image})
    return character
}
const uploadOneImage = async (index) => {
    const fileSource = seed.pathCHImage_full[index]
    const newFileName = uuid.v4() + path.extname(fileSource)
    const directoryTarget = path.join(__dirname, '../../public', newFileName)
    await fs.copyFileSync( fileSource, directoryTarget )
    return newFileName
}
const uploadGenres = async ()=> {
    const genres = MovieGenre.bulkCreate(seed.genres_full)
    return genres
}

const fullLoadMovieCharacters = async ()=>{
    await uploadGenres()
    return await Movie.bulkCreate(seed.movies_full_with_characters, {include: Character})
}

module.exports = {
    correct_user,
    correct_credentials,
    character_correct,
    character_missing_data,
    character_invalid_fields,
    character_movies_id_nonExistent,
    movie_invalid,
    movie_correct,
    image_correct_path,
    image_invalid_path,
    genre_correct,
    uploadOneUser,
    getCountOfUsers,
    cleanDB,
    cleanUser,
    cleanMovies,
    cleanCharacters,
    cleanCharactersXMovies,
    cleanCharactersMoviesImages,
    deletePublicDirContent,
    fillDB,
    uploadMovies,
    uploadCharacters,
    uploadOneMovie,
    uploadOneMovieWithCharacters,
    uploadOneMovieWithImage,
    uploadOneCharacter,
    uploadOneCharacterWithImage,
    uploadGenres,
    fullLoadMovieCharacters
}