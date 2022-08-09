const express = require('express')
require('express-async-errors') // using it skips exception catches
require('./database/association')

const fileUpload = require('express-fileupload')
const {errorHandler} = require('./middleware/errorHandler')

const routeMovie = require('./routes/movies')
const routeCharacter = require('./routes/characters')
const routeUsers = require('./routes/users')
const routeLogin = require('./routes/login')

const app = express()

// =============== ROUTES/MIDDLEWARES ===================

app.use(express.json())
app.use(express.static('public'))
app.use(fileUpload({
    preserveExtension: true
}))

app.use('/auth/register', routeUsers)
app.use('/auth/login', routeLogin)
app.use('/movies',routeMovie)
app.use('/characters', routeCharacter)

app.use(errorHandler)
app.use((request,response) => {response.status(404).json({error: 'Unknown Endpoint.'})}) 

module.exports = app