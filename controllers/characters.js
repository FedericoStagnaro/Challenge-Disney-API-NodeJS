const CharactersXMovies = require('../database/models/CharacterXMovie')
const Character = require('../database/models/Character')
const Movie = require('../database/models/Movie')
const MovieGenre = require('../database/models/MovieGenre')

const sequelize = require('../database/db')

const image_service = require('../utils/util_image')
const util = require('../utils/utilsController')


/**
 * GET => Return (name,image) from all characters 
 * @route /:name?/:age?/:idMovie?
 */
const getAllFiltered = async (request,response) => {
    const filter = util.getFilterFromQueryCharacters(request.query)

    const characters = await Character.findAll({
        where: filter,
        attributes: ['name', 'image'],
        include: {
            model: Movie,
            attributes: [],
            as: 'Movies'
        }
    })
    
    
    //console.log(characters)
    response.status(200).json(characters) 
}

/**
 * GET => Return (*) from character where idCharacter = idQuery
 * @route /characters/id
 */
const getCharacter = async (request,response) => {
    const id = request.params.id

    const character = await Character.findByPk( id ,{
        include: {
            model: Movie,
            as: 'Movies',
            include: MovieGenre
        }
    })
    util.isNotNull(character)
    response.status(200).json(character) 
}

/**
 * POST
 * @route /character/
 */
const createCharacter = async (request,response) => {
    const inputCharacter = {
        name: request.body.name,
        age: request.body.age ,
        weight: request.body.weight ,
        history: request.body.history ,
        movies: request.body.movies ? JSON.parse(request.body.movies) : []
    }
    const inputImage = image_service.getFileImage(request.files)

    const result = await sequelize.transaction( async (t) => {
        const character = await Character.create(inputCharacter,{transaction: t})
        
        await CharactersXMovies.bulkCreate(
            inputCharacter.movies.map(id_m => {
                return {
                    id_character: character.id,
                    id_movie: id_m
                }})
            ,{ 
                skip:['id_character'],
                validate:true ,
                transaction: t
            })
        
        if( inputImage ) {
            const nameImageUUID = image_service.getNameFileUUID(inputImage)
            try {
                image_service.saveImage(inputImage,nameImageUUID)
                await character.update({image: nameImageUUID},{transaction: t})
            } catch (error) {
                image_service.deleteImage(nameImageUUID)
            }
        }
        return character
    })

    response.status(201).json(result)
}

/**
 * PUT
 * Update Character , you must provide all new values, otherwise it will set null value by default.
 * @route /characters/id
 */
const putCharacter = async (request,response) => {
    const id = request.params.id
    const inputCharacter = {
        name: request.body.name,
        age: request.body.age ,
        weight: request.body.weight ,
        history: request.body.history ,
        movies: request.body.movies ? JSON.parse(request.body.movies) : []
    }
    const inputImage = image_service.getFileImage(request.files)

    const result = await sequelize.transaction( async (t) => {
        const character = await Character.findByPk( id, { transaction: t })
        util.isNotNull(character)
        const oldFileImage = character.image
        character.set(inputCharacter)
        await character.validate()
        
        await CharactersXMovies.destroy({where: {id_character: id}, transaction : t})
        await CharactersXMovies.bulkCreate(
            inputCharacter.movies.map(id_m => {
                return {
                    id_character: character.id,
                    id_movie: id_m
                }})
            ,{ 
                skip:['id_character'],
                validate:true ,
                transaction: t
            })

        if (oldFileImage) { await image_service.deleteImage(character.image) }
        if( inputImage ) {
            const nameImageUUID = image_service.getNameFileUUID(inputImage)
            image_service.saveImage(inputImage,nameImageUUID)
            await character.set({image: nameImageUUID})
        }
        await character.save({transaction: t})
        return character
    })

    response.status(200).json(result)
}

/**
 * PATCH
 * Update Character
 * @route /characters/id
 */
const patchCharacter = async (request,response) => {
    const id = request.params.id
    let inputCharacter = request.body
    const inputImage = image_service.getFileImage(request.files)
    if (request.body.movies) { inputCharacter.movies = JSON.parse(request.body.movies) }

    const result = await sequelize.transaction( async (t) => {
        const character = await Character.findByPk( id, { transaction: t })
        util.isNotNull(character)
        const oldFileImage = character.image
        character.set(inputCharacter)
        await character.validate()
        
        if( inputCharacter.movies) {
            await CharactersXMovies.destroy({where: { id_character: id}, transaction: t})
            await CharactersXMovies.bulkCreate(
                inputCharacter.movies.map(id_m => {
                    return {
                        id_character: character.id,
                        id_movie: id_m
                    }})
                ,{ 
                    skip:['id_character'],
                    validate:true ,
                    transaction: t
                })
        } 
        
        if( inputImage ) {
            if (oldFileImage) { await image_service.deleteImage(character.image) }
            const nameImageUUID = image_service.getNameFileUUID(inputImage)
            image_service.saveImage(inputImage,nameImageUUID)
            await character.set({image: nameImageUUID})
        }
        await character.save({transaction: t})
        return character
    })
    response.status(200).json(result)
}

/**
 * DELETE
 *  DELETE Character
 * @route /character/id
 */
const deleteCharacter = async (request,response) => {
    const id = request.params.id

    await sequelize.transaction( async (t) => {
        const character = await Character.findByPk(id,{ transaction: t})
        util.isNotNull(character)
        await Character.destroy({ where: { id: id }, transaction: t })
        if (character.image) {image_service.deleteImage(character.image)}
    })
    response.status(204).end()

}

module.exports = {
    getAllFiltered,
    getCharacter,
    createCharacter,
    putCharacter,
    patchCharacter,
    deleteCharacter
} 