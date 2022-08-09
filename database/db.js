const { Sequelize } = require('sequelize')

// Configuracion de conexion de bases de datos
const config = {
    database: 'Disney',
    username: '',
    password: '',
    dialect: 'sqlite',
    storage: 'disney-db.sqlite',
    logging:  (msg) => console.log(msg)
}
const configForTesting = {
    database: 'Disney',
    username: '',
    password: '',
    dialect: 'sqlite',
    storage: 'disney-db-TEST.sqlite',
    logging: false // (msg) => console.log(msg)
}

// Conexion de bases de datos
const sequelize = process.env.NODE_ENV == 'produccion' 
    ? new Sequelize(config)
    : new Sequelize(configForTesting)


module.exports = sequelize