const jwt = require('jsonwebtoken')
const User = require('../database/models/User')
const bcrypt = require('bcrypt')

class UserValidationError extends Error {
    constructor (message) {
        super(message)
        this.name = 'UserValidationError' 
    }
}

/**
 * Check if are credentials values missing
 * @param Object credentials 
 */
const validateCredentials = (credentials) => {
    if(!credentials.username || !credentials.password) {
        throw new UserValidationError('Credentials must be provided')
    } 
}

/**
 * Async method - Check if the given credentials matches with the user
 * @param Object credentials 
 * @param InstanceOfModelUser user_from_db 
 */
const validateMatchUser = async (credentials , user_from_db ) => {
    if( user_from_db !== null ) {
        const match = await bcrypt.compare(credentials.password,user_from_db.password)
        if ( !match ) {
            throw new UserValidationError('Incorrect username or password')
        }
    }
    else {
        throw new UserValidationError('Incorrect username or password')
    }
}

/**
 * Controller that allows to return a token JWT
 * @response { token , username , name }
 */
const login = async (request,response)=>{
    const credentials = request.body

    validateCredentials(credentials)
    
    const user_from_db = await User.findOne({ 
        where: { username : credentials.username},
        attributes: ['id','username', 'password', 'name', 'role']
    })
    
    await validateMatchUser(credentials,user_from_db)

    const user_payload = { 
        id: user_from_db.id , 
        username: user_from_db.username,
        role: user_from_db.role
    }

    const token = jwt.sign(user_payload, process.env.SECRET, {expiresIn: '10m'})
            
    response
        .status(200)
        .json({
            token: token, 
            username: user_from_db.username, 
            name: user_from_db.name
        })
}



module.exports =  {
    login
}