const chai = require('chai')
const chai_http = require('chai-http')
const expect = chai.expect
chai.use(chai_http)

const helper = require('./helper/utils_test')
const app = require('../app')


describe('Auth - Login', function () {
    describe(' ° Credentials', function (){
        this.beforeAll(async function(){
            await helper.cleanUser()
            this.user = await chai
                .request(app)
                .post('/auth/register')
                .send(helper.correct_user)
        })
        it('Correct input:', async function() {
            const correct_user = {...helper.correct_credentials}
            const response = await chai
                .request(app)
                .post('/auth/login')
                .set('content-type', 'multipart/form-data')
                .field(correct_user)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                username: 'usuario1',
                name: 'nombreUsuario'
            })
        })
        
        it('Exceptions: - username' ,async function() {
            const correct_user = {...helper.correct_credentials}
            correct_user.username = 'BadUser'
            const response = await chai
                .request(app)
                .post('/auth/login')
                .set('content-type', 'multipart/form-data')
                .field(correct_user)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ error: 'Incorrect username or password' })
        })
        it('Exceptions: - password' ,async function() {
            const correct_user = {...helper.correct_credentials}
            correct_user.password = 'BadPassword'
            const response = await chai
                .request(app)
                .post('/auth/login')
                .set('content-type', 'multipart/form-data')
                .field(correct_user)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ error: 'Incorrect username or password' })
        })
    })
})