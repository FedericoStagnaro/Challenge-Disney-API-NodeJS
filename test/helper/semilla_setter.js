const sequelize = require ('../../database/db')
const Character = require('../../database/models/Character')
const Movie = require('../../database/models/Movie')
const MovieGenre = require('../../database/models/MovieGenre')
const User = require('../../database/models/User')
//const CharacterXMovie = require('./database/models/CharacterXMovie')
require('../../database/association')
const fs = require('fs')
const path = require('path')


// MovieGenres
const genres = [
    { name: 'Niños'},
    { name: 'Animacion'},
    { name: 'Fantasia'},
    { name: 'Comedia'}
]

// Movies and Characters  
const prueba_C_X_M = [
    {
        name: 'Monster, Inc.',  // 6 de diciembre de 2001
        releaseDate: '2001-12-06',
        qualification: 5,
        genre_id:4,
        image: null,  // fs.readFileSync(path.join(__dirname , 'movies','monsterinc.jpg')),
        Characters: [
            { name: 'James P. Sullivan', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Mike Wazowski', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Boo', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Roz', age : null, weight: null, history: 'lorem ipsum'}
        ]
    },
    {
        name: 'Frozen',    // 2 de enero de 2014 
        releaseDate: '2014-01-02', 
        qualification: 4, 
        genre_id:1,
        image: null,  // fs.readFileSync( path.join(__dirname , 'movies','frozen.jpg')),
        Characters: [
            { name: 'Elsa', age : 21, weight: null, history: 'lorem ipsum'},
            { name: 'Anna', age : 19, weight: null, history: 'lorem ipsum'},
            { name: 'Olaf', age : null, weight: null, history: 'lorem ipsum'}
        ]
    },
    {
        name: 'Aladdín: el regreso de Jafar',    // 20 de mayo de 1994
        releaseDate: '1994-05-20', 
        qualification: 3, 
        genre_id:3,
        image:null,  //  fs.readFileSync(path.join(__dirname , 'movies','aladdin.jpg')),
        Characters: [
            { name: 'Aladdin', age : 18, weight: null, history: 'lorem ipsum'},
            { name: 'Jasmine', age : 15, weight: null, history: 'lorem ipsum'},
            { name: 'Jafar', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'El Genio', age : null, weight: null, history: 'lorem ipsum'}
        ]
    },
    {
        name: 'Mickey, Donald, Goofy: Los Tres Mosqueteros',    // 17 de agosto de 2004
        releaseDate: '2004-08-17', 
        qualification: 3, 
        genre_id:1,
        image: null,  // fs.readFileSync(path.join(__dirname , 'movies','mickymouse.jpg')),
        Characters: [
            { name: 'Mickey Mouse', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Minnie Mouse', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Pato Donald', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Goofy', age : null, weight: null, history: 'lorem ipsum'}
        ]
    },
    {
        name: 'El Rey Leon',    // 7 de julio de 1994
        releaseDate: '1994-07-07', 
        qualification: 5, 
        genre_id:2,
        image: null,  // fs.readFileSync(path.join(__dirname , 'movies','reyleon.jpg')),
        Characters: [
            { name: 'Simba', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Scar', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Mufasa', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Nala', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Timon', age : null, weight: null, history: 'lorem ipsum'},
            { name: 'Pumba', age : null, weight: null, history: 'lorem ipsum'}
        ]
    }   
]

const userList = [
    {username: 'usernameU1', name: 'nameUno', password: 'PASSwordU1...', email: 'U1@gmail.com'},
    {username: 'usernameU2', name: 'nameDos', password: 'PASSwordU2...', email: 'U2@gmail.com'},
    {username: 'usernameU3', name: 'nameTres', password: 'PASSwordU3...', email: 'U3@gmail.com'},
    {username: 'usernameU4', name: 'nameCuatro', password: 'PASSwordU4...', email: 'U4@gmail.com'}
]

sequelize
    .sync({force:true})
    .then(() => console.log('Conexion full con BD'))
    .then(()=> MovieGenre.bulkCreate(genres))
    .then(() => { Movie.bulkCreate(prueba_C_X_M, {include: Character}) })
    // .then(()=> {
    //     User.bulkCreate(userList)
    // })
