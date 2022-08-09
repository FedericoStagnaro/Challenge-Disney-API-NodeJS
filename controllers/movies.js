const Movie = require('../database/models/Movie')
const MovieGenre = require('../database/models/MovieGenre')
const Character = require('../database/models/Character')
const CharactersXMovies = require('../database/models/CharacterXMovie')
const sequelize = require('../database/db')

const util = require('../utils/utilsController')
const image_service = require('../utils/util_image')

/**
 * GET /movies -> return (name,image) from all movies 
 * @route /:name?/:idGenre?/:order?
 */
const getAllFiltered = async (request,response) => {
    const result = util.getFilterFromQueryMovies(request.query)
    
    const movies = await Movie.findAll({
        where: result.filter,
        attributes: ['name', 'releaseDate' , 'image'],
        order: result.order
    })
    
    response.status(200).json(movies) 
}



/*
 * GET /characters/id (id = int) --> return (*) from character where idMovies = idQuery
 */
const getMovie = async (request,response) => {
    const id = request.params.id

    const movie = await Movie.findByPk(id,{
        include: [{
            model: Character,
            as: 'Characters',
            through: {
                attributes: []
            }
        },{
            model: MovieGenre,
            as: 'MovieGenre'
        }]
    })
    util.isNotNull(movie)
    response.status(200).json(movie)
}


/**
 * POST 
 * @route /movies/
 */
const createMovie = async (request,response) => {
    const inputMovie =  {
        name: request.body.name,
        releaseDate: request.body.releaseDate,
        qualification: request.body.qualification,
        genre_id: request.body.genre_id,
        characters: request.body.characters ? JSON.parse(request.body.characters) : []
    }
    const inputImage = image_service.getFileImage(request.files)

    const result = await sequelize.transaction( async (t) => {
        const movie = await Movie.create(inputMovie, { transaction : t })
        
        await CharactersXMovies.bulkCreate(
            inputMovie.characters.map(id_c => {
                return {
                    id_character: id_c,
                    id_movie: movie.id
                }})
            ,{ 
                skip:['id_movie'],
                validate:true ,
                transaction: t
            })

        if( inputImage ) {
            const nameImageUUID = image_service.getNameFileUUID(inputImage)
            try {
                image_service.saveImage(inputImage,nameImageUUID)
                await movie.update({image: nameImageUUID},{transaction: t})
            } catch (error) {
                image_service.deleteImage(nameImageUUID)
            }
        }   
        return movie
    })

    response.status(201).json(result)
}



/**
 * PUT
 * Update Movie
 * @route /movies/id
 */
const putMovie = async (request,response) => {
    const id = request.params.id
    const inputMovie =  {
        name: request.body.name,
        releaseDate: request.body.releaseDate,
        qualification: request.body.qualification,
        genre_id: request.body.genre_id,
        characters: request.body.characters ? JSON.parse(request.body.characters) : []
    }
    const inputImage = image_service.getFileImage(request.files) 

    const result = await sequelize.transaction(async (t) => {
        const movie = await Movie.findByPk(id, {transaction: t })
        util.isNotNull(movie)
        const oldFileImage = movie.image
        movie.set(inputMovie)
        await movie.validate()

        await movie.update(inputMovie,{transaction: t})

        await CharactersXMovies.destroy({where: {id_movie: id}, transaction: t})
        await CharactersXMovies.bulkCreate(
            inputMovie.characters.map(id_c => {
                return {
                    id_character: id_c,
                    id_movie: movie.id
                }})
        
            ,{ 
                skip:['id_movie'],
                validate:true ,
                transaction: t
            })
        if (oldFileImage) {await image_service.deleteImage(oldFileImage)}
        if( inputImage ) {
            const nameImageUUID = image_service.getNameFileUUID(inputImage)
            try {
                image_service.saveImage(inputImage,nameImageUUID)
                await movie.update({image: nameImageUUID},{transaction: t})
            } catch (error) {
                image_service.deleteImage(nameImageUUID)
            }
        }   
        return movie

    })

    response.status(200).json(result)
}


/**
 * PATCH
 * Update Movie
 * @route /movies/id
 */

const patchMovie = async (request,response) => {
    const id = request.params.id
    let inputMovie = request.body
    const inputImage = image_service.getFileImage(request.files)
    if (request.body.characters) { inputMovie.characters = JSON.parse(request.body.characters) }
   
    const result = await sequelize.transaction(async (t) => {
        const movie = await Movie.findByPk(id, {transaction: t})
        util.isNotNull(movie)
        const oldFileImage = movie.image
        movie.set(inputMovie)
        await movie.validate()

        if ( inputMovie.characters ) {
            await CharactersXMovies.destroy({where:{ id_movie: id}, transaction: t})
            await CharactersXMovies.bulkCreate(
                inputMovie.characters.map(id_c => {
                    return {
                        id_character: id_c,
                        id_movie: movie.id
                    }})
        
                ,{ 
                    skip:['id_movie'],
                    validate:true ,
                    transaction: t
                })
        }
        if( inputImage ) {
            if (oldFileImage) { await image_service.deleteImage(movie.image) }
            const nameImageUUID = image_service.getNameFileUUID(inputImage)
            image_service.saveImage(inputImage,nameImageUUID)
            await movie.set({image: nameImageUUID})
        }
        await movie.save({transaction: t})
        
        return movie
    })
    response.status(200).json(result)
}


/**
 * DELETE
 *  DELETE Movie
 * @route /movies/id
 */
const deleteMovie = async (request,response) => {
    const id = request.params.id

    await sequelize.transaction( async (t) => {
        const movie = await Movie.findByPk(id,{ transaction: t})
        util.isNotNull(movie)
        await Movie.destroy({ where: { id: id }, transaction: t })
        if (movie.image) { image_service.deleteImage(movie.image) }
    })
    response.status(204).end()
}


module.exports = {
    createMovie,
    getAllFiltered,
    getMovie,
    putMovie,
    patchMovie,
    deleteMovie
} 