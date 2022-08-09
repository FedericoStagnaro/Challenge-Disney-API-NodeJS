const chai = require('chai')
const chai_http = require('chai-http')
const expect = chai.expect
chai.use(chai_http)

const helper = require('./helper/utils_test')
const app = require('../app')


describe('Auth - Register', function () {
    describe('Correct save:',function () {
        this.beforeAll(async ()=>{
            await helper.cleanUser()
            this.users_before = await helper.getCountOfUsers()
        })
        it(' - save', async()=>{
            const user = helper.correct_user

            const response = await chai
                .request(app)
                .post('/auth/register')
                .send(user)
    
            expect(response).to.have.status(201)
            expect(response.body).to.deep.equals({ name: 'nombreUsuario', username: 'usuario1', email: 'u1@gmail.com' })
            expect(await helper.getCountOfUsers()).to.be.equal(this.users_before + 1)
        })
    })
    
    describe('Exceptions:' , () =>{
        describe(' ° Name:', function () {
            this.beforeAll(async ()=>{
                await helper.cleanUser()
                this.users_before = await helper.getCountOfUsers()
            })
    
            it(' - missing',async ()=>{
                const user = {...helper.correct_user}
                delete user.name
                
    
                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(user)
    
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({name: 'Name cant be null'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before )
            })
            it(' - alphabetic',async()=>{
                const user = {...helper.correct_user}
                user.name = 'name123'
    
                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(user)
    
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({name: 'The name must have alphabetic characters'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before )
            })
        })
    
        describe(' ° Username:', ()=>{
            this.beforeAll(async ()=>{
                await helper.cleanUser()
                this.users_before = await helper.getCountOfUsers()
            })
    
            it(' - missing',async ()=>{
                const user = {...helper.correct_user}
                delete user.username
                
                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(user)
    
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({username: 'Username cannot be null'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before )
            })
            it(' - alphanumeric',async()=>{
                const user = {...helper.correct_user}
                user.username = 'Username123$%&'
    
                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(user)
    
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({username: 'Username must be alphanumeric'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before )
            })
            it(' - length',async()=>{
                const user = {...helper.correct_user}
                user.username = 'us'
    
                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(user)
    
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({username: 'The username must be between 6 and 15 characters long'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before )
            })
            it(' - unique', async () =>{
                await helper.uploadOneUser()
                const userForSave = {...helper.correct_user}
                userForSave.email = 'newEmail@gmail.com'
        
                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(userForSave)
                    
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({username: 'username must be unique'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before + 1 )
            })
        })
    
        describe(' ° Password:', function(){
            this.beforeAll(async ()=>{
                await helper.cleanUser()
                this.users_before = await helper.getCountOfUsers()
            })
    
            it(' - missing',async ()=>{
                const user = {...helper.correct_user}
                delete user.password
                
                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(user)
    
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({password: 'Password cannot be null'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before )
            })
            it(' - strong Pass',async()=>{
                const user = {...helper.correct_user}
                user.password = 'toWeakPass'
    
                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(user)
    
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({password: 'Password to weak'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before )
            })
        })
        
        describe(' ° Email:', async function(){
            this.beforeAll(async ()=>{
                await helper.cleanUser()
                this.users_before = await helper.getCountOfUsers()
            })
    
            it(' - missing',async ()=>{
                const user = {...helper.correct_user}
                delete user.email
                
                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(user)
    
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({email: 'Email cannot be null'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before )
            })
            it(' - format',async()=>{
                const user = {...helper.correct_user}
                user.email = '@some.com'
    
                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(user)
    
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({email: 'Invalid email format'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before )
            })
            it(' - unique',async()=>{
                await helper.uploadOneUser()
                const userForSave = {...helper.correct_user}
                userForSave.username = 'newUser'

                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(userForSave)
                
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({email: 'email must be unique'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before + 1 )
            })
        })
        describe(' ° Role:', async function (){
            this.beforeAll(async ()=>{
                await helper.cleanUser()
                this.users_before = await helper.getCountOfUsers()
            })
            it(' - role not null',async ()=>{
                const userForSave = {...helper.correct_user}
                delete userForSave.role

                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(userForSave)
                
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({role: 'Role cannot be null'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before)
            })

            it(' - invalid role',async ()=>{
                const userForSave = {...helper.correct_user}
                userForSave.role = 'roleDoesNotExist'

                const response = await chai
                    .request(app)
                    .post('/auth/register')
                    .send(userForSave)
                
                expect(response).to.have.status(400)
                expect(response.body).to.deep.equals({role: 'Valid role needed'})
                expect(await helper.getCountOfUsers()).to.be.equal(this.users_before)
            })
        })
    })
})