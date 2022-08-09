const getErrorObject = (error) => {
    const errObj = {}
    error.errors.map( er => {
        errObj[er.path||er.name] = er.message
    })
    return errObj
}
const getErrorArray = (error) => {
    const errArray = []
    error.errors.map( er => {
        errArray.push(er.message)
    })
    return errArray
}

const errorHandler = (error,request,response,next) => {

    if ( error.name == 'JsonWebTokenError' ) {
        return response.status(401).json({error: error.message})
    }
    if ( error.name == 'TokenExpiredError' ) {
        return response.status(401).json({error: error.message})
    }
    
    if ( error.name == 'SequelizeValidationError' ) {
        return response.status(400).json(getErrorObject(error))
    }

    if ( error.name == 'AggregateError' ) {
        return response.status(400).json(getErrorArray(error))
    }

    if (error.name == 'SequelizeUniqueConstraintError') {
        return response.status(400).json(getErrorObject(error))
    }

    if ( error.name == 'ControllerError') {
        return response.status(404).json({error: error.message})
    }

    if ( error.name == 'ImageError') {
        return response.status(400).json(getErrorObject(error))
    }

    if (error.name == 'UserValidationError') {
        return response.status(400).json({error: error.message})
    }

    if (error.code == 'ENOENT') {
        return response.status(404).json({error: 'Resource not founded'})
    }

    next()
}


module.exports = {
    errorHandler
}