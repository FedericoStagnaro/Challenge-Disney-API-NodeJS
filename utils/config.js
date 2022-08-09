require('dotenv').config()

const PORT = process.env.PORT || 3000
const SECRET = process.env.SECRET || 'test'
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

module.exports = {
    PORT,
    SECRET,
    SENDGRID_API_KEY
}
