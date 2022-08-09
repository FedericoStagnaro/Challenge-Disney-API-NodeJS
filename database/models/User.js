const { Model , DataTypes } = require('sequelize')
const sequelize = require('../db')
const sgMail = require('@sendgrid/mail')
const bcrypt = require('bcrypt')
const SENDGRID_API_KEY = require('../../utils/config').SENDGRID_API_KEY
require('dotenv').config()

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username: {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            notNull: {
                msg: 'Username cannot be null'
            },
            isAlphanumeric: {
                msg: 'Username must be alphanumeric'
            },
            len: {
                args: [6,15],
                msg: 'The username must be between 6 and 15 characters long'
            }
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull: {
                msg: 'Name cant be null'
            },
            isAlpha: {
                msg: 'The name must have alphabetic characters'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            notNull: { msg: 'Password cannot be null' },
            passwordStrength: (password) =>{
                if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(password)) ) {
                    throw new Error('Password to weak')
                } 
            }
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Role cannot be null'},
            isIn: { 
                args:[['admin','consumer']],
                msg: 'Valid role needed'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull:false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Email cannot be null'
            },
            isEmail: {
                msg: 'Invalid email format'
            }
        }
    }
},{
    sequelize,
    timestamps:false,
    tableName: 'Users',
    modelName: 'User'
})

User.addHook('beforeCreate', async (user) => {
    user.password = await bcrypt.hash(user.password,10)
})

User.addHook('afterCreate', (user)=>{
    sgMail.setApiKey(SENDGRID_API_KEY)

    const msg = {
        to: user.email, 
        from: 'disneyappalkemy@gmail.com', 
        subject: 'Welcome to disney api',
        html: 
           `<strong>
                Hello ${user.name}!
            </strong><br/>
            <p>
                Now you can log in and have access to the api
            </p>`
    }
    
    if(process.env.NODE_ENV == 'production') {
        sgMail
            .send(msg)
            .catch((error) => {
                console.error(error)
            })
    } 
    
})

module.exports = User