const chai = require('chai')
const chai_http = require('chai-http')
chai.use(chai_http)
const expect = chai.expect

const app = require('../app')
const Character = require('../database/models/Character')
const helper = require('./helper/utils_test')

const fs = require('fs')
const path = require('path')

describe('Character controller', function () {
    // Admin or consumer needs to be logged to access this routes
    this.timeout(3000)
    this.beforeAll(async function(){
        await helper.cleanUser()
        await chai
            .request(app)
            .post('/auth/register')
            .send(helper.correct_user)
        this.token = (await chai
            .request(app)
            .post('/auth/login')
            .set('content-type', 'multipart/form-data')
            .field(helper.correct_credentials)).body.token
        this.bearerToken = 'Bearer ' + this.token
        this.directoryPublic = path.join(__dirname, '../public')
    })

    describe(' ° GET - /characters/', function () {
        this.beforeAll(async ()=>{
            await helper.cleanCharactersMoviesImages()
            this.bearerToken = this.parent.ctx['bearerToken']
            this.movies = await helper.fullLoadMovieCharacters()
        })

        it(' - /characters/ ', async ()=>{
            const response = await chai
                .request(app)
                .get('/characters')
                .set('Authorization', this.bearerToken)
        
            expect(response).to.have.status(200)
            expect(response.body).to.have.length(22)
        })

        it(' - /characters?name=Nombre', async ()=>{
            const response = await chai
                .request(app)
                .get('/characters?name=Boo')
                .set('Authorization', this.bearerToken)

            expect(response).to.have.status(200)
            expect(response.body).to.have.length(1)
            expect(response.body[0].name).to.own.include('Boo')
        })

        it(' - /characters?age=Age', async ()=>{
            const response = await chai
                .request(app)
                .get('/characters?age=21')
                .set('Authorization', this.bearerToken)
        
            expect(response).to.have.status(200)
            expect(response.body).to.have.length(1)
            expect(response.body[0].name).to.be.equal('Elsa')
        })

        it(' - /characters?idMovie=[1,2,...,n]', async ()=>{
            const response = await chai
                .request(app)
                .get(`/characters?idMovie=[${this.movies[0].id}]`)
                .set('Authorization', this.bearerToken)
        
            expect(response).to.have.status(200)
            expect(response.body).to.have.length(this.movies[0].Characters.length)
        })
    
        it(' - /characters/:id ', async ()=>{
            const response = await chai
                .request(app)
                .get(`/characters/${this.movies[0].Characters[0].id}`)
                .set('Authorization', this.bearerToken)

            expect(response).to.have.status(200)
            expect(response.body).to.own.includes({
                id: 1,
                name: 'James P. Sullivan',
                age: null,
                weight: null,
                history: 'lorem ipsum',
                image: null
            })
        })

        it(' - /image.jpg ', async ()=>{
            const characterWithImage = await helper.uploadOneCharacterWithImage(0)
            const response = await chai
                .request(app)
                .get(`/${characterWithImage.image}`)

            expect(response).to.have.status(200)
        })
    })
    
    // ======================================================================================================================

    describe(' ° POST - /characters', function () {
        this.beforeAll(async ()=> {
            await helper.cleanCharactersMoviesImages()
            this.bearerToken = this.parent.ctx['bearerToken']
            this.directoryPublic = this.parent.ctx['directoryPublic']
            this.movies = await helper.fullLoadMovieCharacters()
        })

        it(' - valid fields', async function () {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/characters')
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({...helper.character_correct, movies: '[1]'}) // Require initial movies_id = 1
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(201)
            expect(response.body).to.own.include({name: 'Sullivan',age: '30', weight: '500', history: 'Lorem Ipsunm'})
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore + 1)   
        })


        it(' - missing fields', async function () {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/characters')
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.character_missing_data)   

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({name: 'Name cannot be null'})
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })


        it(' - invalid data types fields array error', async function () {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/characters')
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.character_invalid_fields)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ 
                age: 'Age must be an integer', 
                weight: 'Weight must be a float'
            })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)
        })


        it(' - id movies does not exist ', async function () {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/characters')
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({ ...helper.character_correct, movies: '[ 99999, 88888 , 77777 ]' })
                .attach('image', helper.image_correct_path)


            expect(response).to.have.status(400)
            expect(response.body).to.have.all.members([
                'Validation error: Movie with id 99999 not finded',
                'Validation error: Movie with id 88888 not finded',
                'Validation error: Movie with id 77777 not finded'
            ])
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)
        })


        it(' - invalid file type ', async function () {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/characters')
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({ ...helper.character_correct})
                .attach('image', helper.image_invalid_path)


            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ ext: 'File type must be jpeg, jpg, png...' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)
        })
    })

    // ======================================================================================================================

    describe(' ° PUT - /characters/id', function () {
        this.beforeAll(async ()=> {
            await helper.cleanCharactersMoviesImages()
            this.bearerToken = this.parent.ctx['bearerToken']
            this.directoryPublic = this.parent.ctx['directoryPublic']
            this.movies = await helper.fullLoadMovieCharacters()
            this.characterToUpdate = await helper.uploadOneCharacter(0)
            this.characterToUpdateWithImage = await helper.uploadOneCharacterWithImage(0)
        })

        it(' - valid fields : without image before', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/characters/${this.characterToUpdate.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({...helper.character_correct, movies: '[1]'})
                .attach('image',helper.image_correct_path)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({name: 'Sullivan',age: '30', weight: '500', history: 'Lorem Ipsunm'})
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore + 1)   
        })

        it(' - valid fields : with image before', async () => {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/characters/${this.characterToUpdateWithImage.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({...helper.character_correct, movies: '[1]'})
                .attach('image',helper.image_correct_path)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({name: 'Sullivan',age: '30', weight: '500', history: 'Lorem Ipsunm'})
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - missing fields', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/characters/${this.characterToUpdate.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.character_missing_data)
                
            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({name: 'Name cannot be null'})
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - character id does not exist', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length
            
            const response = await chai
                .request(app)
                .put('/characters/9999999')
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.character_correct)
                .attach('image',helper.image_correct_path)
                        
            expect(response).to.have.status(404)
            expect(response.body).to.deep.equals({ error: 'Resource not found' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - invalid data types fields array error', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/characters/${this.characterToUpdate.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.character_invalid_fields)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ 
                age: 'Age must be an integer', 
                weight: 'Weight must be a float',
            })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)
        })

        it(' - invalid file type', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/characters/${this.characterToUpdate.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.character_correct)
                .attach('image', helper.image_invalid_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ ext: 'File type must be jpeg, jpg, png...' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)
        })
    })
    // ======================================================================================================================

    describe(' ° PATCH', function () {
        this.beforeAll(async ()=> {
            await helper.cleanCharactersMoviesImages()
            this.bearerToken = this.parent.ctx['bearerToken']
            this.directoryPublic = this.parent.ctx['directoryPublic']
            this.movies = await helper.fullLoadMovieCharacters()
            this.characterToUpdate = await helper.uploadOneCharacter(0)
            this.characterToUpdateWithImage = await helper.uploadOneCharacterWithImage(0)
        })

        it(' - no data does not update anything', async () => {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const newData = {}
        
            const response = await chai
                .request(app)
                .patch(`/characters/${this.characterToUpdate.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(newData)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                name: this.characterToUpdate.name,
                age: this.characterToUpdate.age,
                weight: this.characterToUpdate.weight,
                history: this.characterToUpdate.history
            })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - character id does not exist', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length
        
            const response = await chai
                .request(app)
                .patch('/characters/9999999')
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.character_correct)
                .attach('image',helper.image_correct_path)
                    
            expect(response).to.have.status(404)
            expect(response.body).to.deep.equals({ error: 'Resource not found' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - invalid data types array error', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/characters/${this.characterToUpdate.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.character_invalid_fields)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ 
                age: 'Age must be an integer', 
                weight: 'Weight must be a float',
            })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)
        })

        it(' - invalid file type', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/characters/${this.characterToUpdate.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.character_correct)
                .attach('image', helper.image_invalid_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ ext: 'File type must be jpeg, jpg, png...' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)
        })

        it(' - correct update without image before', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/characters/${this.characterToUpdate.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({ ...helper.character_correct,
                    name: 'nuevoNombre',
                    age: 40,
                    weight: 500,
                    history: 'newHistory',
                    movies: '[1]'})
                .attach('image',helper.image_correct_path)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                name: 'nuevoNombre',
                age: '40',
                weight: '500',
                history: 'newHistory',})
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore + 1)   
        })

        it(' - correct update with image before', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/characters/${this.characterToUpdateWithImage.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({ ...helper.character_correct,
                    name: 'nuevoNombre',
                    age: 40,
                    weight: 500,
                    history: 'newHistory',
                    movies: '[1]'})
                .attach('image',helper.image_correct_path)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                name: 'nuevoNombre',
                age: '40',
                weight: '500',
                history: 'newHistory',})
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })
    })

    // ======================================================================================================================
    describe(' ° DELETE', function () {
        this.beforeAll(async ()=> {
            await helper.cleanCharactersMoviesImages()
            this.bearerToken = this.parent.ctx['bearerToken']
            this.directoryPublic = this.parent.ctx['directoryPublic']
            this.movies = await helper.fullLoadMovieCharacters()
            this.characterToUpdateWithImage = await helper.uploadOneCharacterWithImage(0)
        })

        it(' - existing id', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .delete(`/characters/${this.characterToUpdateWithImage.id}`)
                .set('Authorization', this.bearerToken)


            const ch_after = await Character.findByPk(this.characterToUpdateWithImage.id)
            expect(response).to.have.status(204)
            expect(response.body).to.be.empty
            expect(ch_after).to.be.null
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore - 1)
        })

        it(' - character id does not exist', async ()=> {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .delete('/characters/99999')
                .set('Authorization', this.bearerToken)

            expect(response).to.have.status(404)
            expect(response.body).to.deep.equals( { error: 'Resource not found' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)
        })
    })
})