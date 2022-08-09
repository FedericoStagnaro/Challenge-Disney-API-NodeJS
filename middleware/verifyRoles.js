const verifyRoles = (...roles) => {
    return (request, response, next) => {
        if(roles.includes(request.user.role)) {
            next()
        }
        else {
            response.status(401).end()
        }
    }
}

module.exports = {verifyRoles}