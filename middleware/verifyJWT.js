const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = async (request, response, next) =>{
    const authHeader = request.headers.authorization || request.headers.Authorization 

    if(!authHeader ) { return response.sendStatus(401).end() }
    if(!(authHeader.toString().startsWith('Bearer '))) { return response.sendStatus(401) }

    const token = authHeader.split(' ')[1]
    const match = await jwt.verify(token,process.env.SECRET)

    if(match) { 
        request.user = {
            id: match.id,
            username: match.username,
            role: match.role
        } 
        next()
    }
}

module.exports = { verifyJWT }