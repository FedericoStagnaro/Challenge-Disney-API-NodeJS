// const fs = require('fs')
const path = require('path')


// ======================================== USERS =======================================================

const user1 = {username: 'usernameU1', name: 'nameUno', password: 'PASSwordU1...', email: 'U1@gmail.com'}
const user2 =  {username: 'usernameU2', name: 'nameDos', password: 'PASSwordU2...', email: 'U2@gmail.com'}
const user3 = {username: 'usernameU3', name: 'nameTres', password: 'PASSwordU3...', email: 'U3@gmail.com'}
const user4 = {username: 'usernameU4', name: 'nameCuatro', password: 'PASSwordU4...', email: 'U4@gmail.com'}

const userList = [ user1, user2, user3, user4 ]

// ============================================ CHARACTERS =================================================
const character1 =  { name: 'James P. Sullivan', age : null, weight: null, history: 'lorem ipsum'}
const character2 =  { name: 'Mike Wazowski', age : null, weight: null, history: 'lorem ipsum'}
const character3 = { name: 'Boo', age : null, weight: null, history: 'lorem ipsum'}
const character4 = { name: 'Roz', age : null, weight: null, history: 'lorem ipsum'}

const character5 = { name: 'Elsa', age : 21, weight: null, history: 'lorem ipsum'}
const character6 = { name: 'Anna', age : 19, weight: null, history: 'lorem ipsum' }
const character7 = { name: 'Olaf', age : null, weight: null, history: 'lorem ipsum'}

const character8 = { name: 'Aladdin', age : 18, weight: null, history: 'lorem ipsum'}
const character9 = { name: 'Jasmine', age : 15, weight: null, history: 'lorem ipsum'}
const character10 = { name: 'Jafar', age : null, weight: null, history: 'lorem ipsum'}
const character11 = { name: 'El Genio', age : null, weight: null, history: 'lorem ipsum'}

const character12 = { name: 'Mickey Mouse', age : null, weight: null, history: 'lorem ipsum'}
const character13 = { name: 'Minnie Mouse', age : null, weight: null, history: 'lorem ipsum'}
const character14 = { name: 'Pato Donald', age : null, weight: null, history: 'lorem ipsum'}
const character15 = { name: 'Goofy', age : null, weight: null, history: 'lorem ipsum'}

const character16 = { name: 'Simba', age : null, weight: null, history: 'lorem ipsum'}
const character17 = { name: 'Scar', age : null, weight: null, history: 'lorem ipsum'}
const character18 = { name: 'Mufasa', age : null, weight: null, history: 'lorem ipsum'}
const character19 = { name: 'Nala', age : null, weight: null, history: 'lorem ipsum'}
const character20 = { name: 'Timon', age : null, weight: null, history: 'lorem ipsum'}
const character21 = { name: 'Pumba', age : null, weight: null, history: 'lorem ipsum'}

const charaters_movie_1 = [ character1,character2,character3,character4]
const charaters_movie_2 = [ character5, character6, character7, ]
const charaters_movie_3 = [ character8, character9, character10, character11 ]
const charaters_movie_4 = [ character12, character13, character14, character15 ]
const charaters_movie_5 = [ character16, character16, character17, character18, character19, character20, character21 ]

let characters_full = [
    character1,
    character2,
    character3,
    character4,
    character5,
    character6,
    character7,
    character8,
    character9,
    character10,
    character11,
    character12,
    character13,
    character14,
    character15,
    character16,
    character17,
    character18,
    character19,
    character20,
    character21,
]


//========================================= GENRES ======================================
const genres_full = [
    { name: 'Niños'},
    { name: 'Animacion'},
    { name: 'Fantasia'},
    { name: 'Comedia'}
]

// ============================================ MOVIES ==================================
const movie1 = {
    name: 'Monster, Inc.',  // 6 de diciembre de 2001
    releaseDate: '2001-12-06',
    qualification: 5,
    genre_id:4,
    image: null,
}
const movie_1_with_Characters = {...movie1, Characters: charaters_movie_1}

const movie2 = {
    name: 'Frozen',    // 2 de enero de 2014 
    releaseDate: '2014-01-02', 
    qualification: 4, 
    genre_id:1,
    image: null,
}
const movie_2_with_Characters = {...movie2, Characters: charaters_movie_2}

const movie3 = {
    name: 'Aladdín: el regreso de Jafar',    // 20 de mayo de 1994
    releaseDate: '1994-05-20', 
    qualification: 3, 
    genre_id:3,
    image: null,
}
const movie_3_with_Characters = {...movie3, Characters: charaters_movie_3}

const movie4 = {
    name: 'Mickey, Donald, Goofy: Los Tres Mosqueteros',    // 17 de agosto de 2004
    releaseDate: '2004-08-17', 
    qualification: 3, 
    genre_id:1,
    image: null,    
}
const movie_4_with_Characters = {...movie4, Characters: charaters_movie_4}

const movie5 = {
    name: 'El Rey Leon',    // 7 de julio de 1994
    releaseDate: '1994-07-07', 
    qualification: 5, 
    genre_id:2,
    image: null,
}
const movie_5_with_Characters = {...movie5, Characters: charaters_movie_5}

const movies_full = [movie1,movie2,movie3,movie4,movie5]

const movies_full_with_characters = [
    movie_1_with_Characters,
    movie_2_with_Characters,
    movie_3_with_Characters,
    movie_4_with_Characters,
    movie_5_with_Characters,
]

// ========================================== IMAGES =========================================

const pathCHImage1 = path.join(__dirname , 'characters','sullivan.jpg')
const pathCHImage2 = path.join(__dirname , 'characters','mike.jpg')
const pathCHImage3 = path.join(__dirname , 'characters','boo.jpg')
const pathCHImage4 = path.join(__dirname , 'characters','roz.jpg')
const pathCHImage5 = path.join(__dirname , 'characters','elsa.jpg')
const pathCHImage6 = path.join(__dirname , 'characters','anna.jpg')
const pathCHImage7 = path.join(__dirname , 'characters','olaf.jpg')
const pathCHImage8 = path.join(__dirname , 'characters','aladdin.jpg')
const pathCHImage9 = path.join(__dirname , 'characters','jasmine.jpg')
const pathCHImage10 = path.join(__dirname , 'characters','jafar.jpg')
const pathCHImage11 = path.join(__dirname , 'characters','genio.jpg')
const pathCHImage12 = path.join(__dirname , 'characters','mickey.jpg')
const pathCHImage13 = path.join(__dirname , 'characters','minnie.jpg')
const pathCHImage14 = path.join(__dirname , 'characters','pato donald.jpg')
const pathCHImage15 = path.join(__dirname , 'characters','goofy.jpg')
const pathCHImage16 = path.join(__dirname , 'characters','simba.jpg')
const pathCHImage17 = path.join(__dirname , 'characters','scar.jpg')
// const pathCHImage18 = path.join(__dirname , 'characters','mufasa.jpg')
const pathCHImage19 = path.join(__dirname , 'characters','nala.jpg')
const pathCHImage20 = path.join(__dirname , 'characters','timon.jpg')
const pathCHImage21 = path.join(__dirname , 'characters','pumba.jpg')


const pathCHImage_full = [
    pathCHImage1,
    pathCHImage2,
    pathCHImage3,
    pathCHImage4,
    pathCHImage5,
    pathCHImage6,
    pathCHImage7,
    pathCHImage8,
    pathCHImage9,
    pathCHImage10,
    pathCHImage11,
    pathCHImage12,
    pathCHImage13,
    pathCHImage14,
    pathCHImage15,
    pathCHImage16,
    pathCHImage17,
    // pathCHImage18,
    pathCHImage19,
    pathCHImage20,
    pathCHImage21
]


// const image_movies = [
//     fs.readFileSync(path.join(__dirname , 'movies','monsterinc.jpg')),
//     fs.readFileSync( path.join(__dirname , 'movies','frozen.jpg')),
//     fs.readFileSync(path.join(__dirname , 'movies','aladdin.jpg')),
//     fs.readFileSync(path.join(__dirname , 'movies','mickymouse.jpg')),
//     fs.readFileSync(path.join(__dirname , 'movies','reyleon.jpg'))
// ]


module.exports = {
    character1,
    character2,
    character3,
    character4,
    character5,
    character6,
    character7,
    character8,
    character9,
    character10,
    character11,
    character12,
    character13,
    character14,
    character15,
    character16,
    character17,
    character18,
    character19,
    character20,
    character21,
    characters_full,
    charaters_movie_1,
    charaters_movie_2,
    charaters_movie_3,
    charaters_movie_4,
    charaters_movie_5,
    movie1,
    movie2,
    movie3,
    movie4,
    movie5,
    movie_1_with_Characters,
    movie_2_with_Characters,
    movie_3_with_Characters,
    movie_4_with_Characters,
    movie_5_with_Characters,
    movies_full,
    genres_full,
    userList,
    pathCHImage_full,
    movies_full_with_characters
}