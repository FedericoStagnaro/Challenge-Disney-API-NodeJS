const app =  require('./app') 
const sequelize = require('./database/db')
const PORT = require('./utils/config').PORT

const connectDB = async ()=> {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Database connected')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

app.listen(PORT, async ()=> {
    console.log('Server listen on port:', PORT)
    await connectDB()
})

