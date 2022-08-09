const { Op } = require('sequelize')


class ControllerError extends Error {
    constructor (message) {
        super(message),
        this.name = 'ControllerError'
    }
}

/**
     * Check if passed querys can be processed, returns a filter , and order if exist
     * @param request.query requestQuery 
     * @returns Filter Order
     */
const getFilterFromQueryMovies = (requestQuery) => {
    const ORDER_TYPES = [ 'ASC' , 'DESC']
    let filter = {}
    let order = []
    if( requestQuery.name ) { filter.name = requestQuery.name }
    if( requestQuery.genre ) { filter.genre_id = requestQuery.genre }
    if( requestQuery.order  ) { 
        if ( ORDER_TYPES.includes(requestQuery.order)) {
            order.push(['releaseDate' , requestQuery.order])
        } 
        else {
            throw new ControllerError(`Cannot order movies in :${requestQuery.order}`)
        }
    }

    return {
        filter,
        order
    }
}

/**
     * Check if passed querys can be processed, returns a filter 
     * @param request.query requestQuery 
     * @returns Filter 
     */
const getFilterFromQueryCharacters = (requestQuery) => {
    let filter = {}
    if(requestQuery.name) {filter.name = requestQuery.name}
    if(requestQuery.age) {filter.age = requestQuery.age}
    if(requestQuery.idMovie) {filter['$Movies.id$'] = { [Op.in] : eval(requestQuery.idMovie)}}

    return filter
}
    

/**
     * Throw an error if is it null
     * @param Model object 
     * @returns boolean
     */
const isNotNull = (model) => {
    if (model) {
        return true
    } else {
        throw new ControllerError('Resource not found')
    }
}



module.exports = {
    getFilterFromQueryMovies,
    getFilterFromQueryCharacters,
    isNotNull
}