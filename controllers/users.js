const User = require('../database/models/User')

/**
 * Controller that allows to create a new user
 * @response { user } 
 */
const createUser = async function (request,response) {
    const user = request.body

    const userSaved = await User.create(user)

    const userResponse = {...userSaved.dataValues}
    delete userResponse.password
    delete userResponse.id
    delete userResponse.role
    response.status(201).json(userResponse)
}


module.exports = {
    createUser
}