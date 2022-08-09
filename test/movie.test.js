const chai = require('chai')
const chai_http = require('chai-http')
chai.use(chai_http)
const expect = chai.expect

const app = require('../app')
const Movie = require('../database/models//Movie')
const helper = require('./helper/utils_test')

const path = require('path')
const fs = require('fs')


describe('Movie Controller',function () {
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

    describe(' ° GET - /movies/', function () {
        this.beforeAll(async ()=>{
            await helper.cleanCharactersMoviesImages()
            this.bearerToken = this.parent.ctx['bearerToken']
            this.character = await helper.uploadOneCharacter(0)
            this.movies =  await helper.uploadMovies()
        })

        it(' - /movies/ ', async ()=>{
            const response = await chai
                .request(app)
                .get('/movies')
                .set('Authorization', this.bearerToken)
            expect(response).to.have.status(200)
            expect(response.body).to.have.lengthOf(this.movies.length)
        })

        it(' - /movies/:name? ', async ()=>{
            const response = await chai
                .request(app)
                .get('/movies?name=Frozen')
                .set('Authorization', this.bearerToken)

            expect(response).to.have.status(200)
            expect(response.body).to.have.lengthOf(1)
            expect(response.body).to.deep.equals([{ releaseDate: '2014-01-02', name: 'Frozen', image: null }])        
        })

        it(' - /movies/:genre?', async ()=>{
            const response = await chai
                .request(app)
                .get('/movies?genre=1')
                .set('Authorization', this.bearerToken)

            expect(response).to.have.status(200)
            expect(response.body).to.have.lengthOf(2)
            expect(response.body).to.deep.equals([
                { releaseDate: '2014-01-02', name: 'Frozen', image: null },
                {
                    releaseDate: '2004-08-17',
                    name: 'Mickey, Donald, Goofy: Los Tres Mosqueteros',
                    image: null
                }
            ])  
        })

        it(' - /movies/:idGenre?/:order? ', async ()=>{
            const response = await chai
                .request(app)
                .get('/movies?genre=1&order=ASC')
                .set('Authorization', this.bearerToken)

            expect(response).to.have.status(200)
            expect(response.body).to.have.lengthOf(2)
            expect(response.body).to.deep.equals([
                {
                    releaseDate: '2004-08-17',
                    name: 'Mickey, Donald, Goofy: Los Tres Mosqueteros',
                    image: null
                },{ releaseDate: '2014-01-02', name: 'Frozen', image: null }
            ])  
        })

        it(' - /movies/:id ', async ()=>{
            const response = await chai
                .request(app)
                .get('/movies/1')
                .set('Authorization', this.bearerToken)

            expect(response).to.have.status(200)
            expect(response.body).to.deep.equals({
                releaseDate: '2001-12-06',
                id: 1,
                name: 'Monster, Inc.',
                qualification: 5,
                genre_id: 4,
                image: null,
                Characters: [],
                MovieGenre: { id: 4, name: 'Comedia' }
            })
        })

        it(' - /image.jpg ', async ()=>{
            const movieWithImage = await helper.uploadOneMovieWithImage(0)
            const response = await chai
                .request(app)
                .get(`/${movieWithImage.image}`)
                .set('Authorization', this.bearerToken)

            expect(response).to.have.status(200)
        })

    })

    // ======================================================================================================================
    
    describe(' ° POST - /movies/', function () {
        this.beforeAll(async ()=>{
            await helper.cleanCharactersMoviesImages()
            this.character = await helper.uploadOneCharacter(0)
            await helper.uploadGenres()
            this.bearerToken = this.parent.ctx['bearerToken']
            this.directoryPublic = path.join(__dirname, '../public')
        })

        it(' - valid input ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/movies')
                .set('content-type', 'multipart/form-data')
                .set('Authorization', this.bearerToken)
                .field(helper.movie_correct)

            expect(response).to.have.status(201)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - valid input + with image', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/movies')
                .set('content-type', 'multipart/form-data')
                .set('Authorization', this.bearerToken)
                .field(helper.movie_correct)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(201)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore + 1)   
        })

        it(' - invalid type file', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/movies')
                .set('content-type', 'multipart/form-data')
                .set('Authorization', this.bearerToken)
                .field(helper.movie_correct)
                .attach('image', helper.image_invalid_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ ext: 'File type must be jpeg, jpg, png...' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - invalid field types', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/movies')
                .set('content-type', 'multipart/form-data')
                .set('Authorization', this.bearerToken)
                .field(helper.movie_invalid)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({
                name: 'Name cannot be null',
                qualification: 'Qualification must be an integer',
                genre_id: 'Cannot find that genre id' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' -  valid + existing character ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/movies')
                .set('content-type', 'multipart/form-data')
                .set('Authorization', this.bearerToken)
                .field({ ...helper.movie_correct, characters: '[ 1 ]'})
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(201)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore + 1)   
        })

        it(' -  valid + no existing character ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .post('/movies')
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({ ...helper.movie_correct, characters: '[ 99999 , 88888 , 77777]'})
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(400)
            expect(response.body).to.include.members([
                'Validation error: Character with id 99999 not finded',
                'Validation error: Character with id 88888 not finded',
                'Validation error: Character with id 77777 not finded'])
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })
    })

    // ======================================================================================================================
    
    describe(' ° PUT - /movies/id', function () {

        this.timeout(9000)
        this.beforeAll(async ()=>{
            await helper.cleanCharactersMoviesImages()
            this.bearerToken = this.parent.ctx['bearerToken']
            await helper.uploadGenres()
            this.character = await helper.uploadOneCharacter(0)
            this.directoryPublic = path.join(__dirname, '../public')
            this.movie = await helper.uploadOneMovie(0)
        })
        it(' - missing id', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put('/movies/9999')
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_correct)
            
            expect(response).to.have.status(404)
            expect(response.body).to.deep.equal({ error: 'Resource not found' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - valid input', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_correct)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - valid input + image : prevNoImage ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_correct)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore + 1 )   
        })

        it(' - valid input + image : prevImage ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_correct)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore )   
        })

        it(' - invalid type file', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_correct)
                .attach('image', helper.image_invalid_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ ext: 'File type must be jpeg, jpg, png...' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - invalid field types', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_invalid)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({
                name: 'Name cannot be null',
                qualification: 'Qualification must be an integer',
                genre_id: 'Cannot find that genre id' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' -  valid + existing character ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length


            const response = await chai
                .request(app)
                .put(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({ ...helper.movie_correct, characters: `[${this.character.id}]`})
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore )   
        })

        it(' -  valid + no existing character ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .put(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({ ...helper.movie_correct, characters: '[ 99999 , 88888 , 77777]'})
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(400)
            expect(response.body).to.have.all.members([
                'Validation error: Character with id 99999 not finded',
                'Validation error: Character with id 88888 not finded',
                'Validation error: Character with id 77777 not finded'])
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })
    })

    // ======================================================================================================================

    describe(' ° PATCH - /movies/id', function () {
        this.timeout(9000)
        this.beforeAll(async ()=>{
            await helper.cleanCharactersMoviesImages()
            this.bearerToken = this.parent.ctx['bearerToken']
            await helper.uploadGenres()
            this.character = await helper.uploadOneCharacter(0)
            this.movie = await helper.uploadOneMovie(0)
            this.movieWithImage = await helper.uploadOneMovieWithImage(0)
            this.directoryPublic = path.join(__dirname, '../public')
        })

        it(' - missing id', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch('/movies/9999')
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_correct)
            
            expect(response).to.have.status(404)
            expect(response.body).to.deep.equal({ error: 'Resource not found' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - valid input', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_correct)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - valid input + image : prevNoImage ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_correct)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore + 1 )   
        })

        it(' - valid input + image : prevImage ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/movies/${this.movieWithImage.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_correct)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore )   
        })

        it(' - invalid type file', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_correct)
                .attach('image', helper.image_invalid_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({ ext: 'File type must be jpeg, jpg, png...' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' - invalid field types', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field(helper.movie_invalid)
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(400)
            expect(response.body).to.deep.equals({
                qualification: 'Qualification must be an integer',
                genre_id: 'Cannot find that genre id' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' -  valid + existing character ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({ ...helper.movie_correct, characters: `[${this.character.id}]`})
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(200)
            expect(response.body).to.own.include({
                ...helper.movie_correct,
                qualification: '4',
                genre_id: '1' })
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })

        it(' -  valid + no existing character ', async ()=>{
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .patch(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)
                .set('content-type', 'multipart/form-data')
                .field({ ...helper.movie_correct, characters: '[ 99999 , 88888 , 77777]'})
                .attach('image', helper.image_correct_path)

            expect(response).to.have.status(400)
            expect(response.body).to.have.all.members([
                'Validation error: Character with id 99999 not finded',
                'Validation error: Character with id 88888 not finded',
                'Validation error: Character with id 77777 not finded'])
            expect(fs.readdirSync(this.directoryPublic).length).to.be.equal(lengthPublicDirBefore)   
        })
    })

    // ======================================================================================================================

    describe(' ° DELETE - /movies/id', function () {
        this.timeout(9000)
        this.beforeEach(async ()=>{
            await helper.cleanCharactersMoviesImages()
            this.bearerToken = this.parent.ctx['bearerToken']
            await helper.uploadGenres()
            this.movie = await helper.uploadOneMovie(0)
            this.directoryPublic = path.join(__dirname, '../public')
        })
        
        it(' - existing id', async ()=> {
            const response = await chai
                .request(app)
                .delete(`/movies/${this.movie.id}`)
                .set('Authorization', this.bearerToken)

            const mo_after = await Movie.findByPk(this.movie.id)
            expect(response).to.have.status(204)
            expect(response.body).to.be.empty
            expect(mo_after).to.be.null
        })

        it(' - existing id : deleted image', async function () {  
            const movieWithImage = await helper.uploadOneMovieWithImage(0)
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            await chai
                .request(app)
                .delete(`/movies/${movieWithImage.id}`)
                .set('Authorization', this.bearerToken)

            const lengthPublicDirAfter = fs.readdirSync(this.directoryPublic).length
            expect(lengthPublicDirAfter).to.be.equal(lengthPublicDirBefore - 1)
        })

        it(' - id does not exist', async function () {
            const lengthPublicDirBefore = fs.readdirSync(this.directoryPublic).length

            const response = await chai
                .request(app)
                .delete('/movies/99999')
                .set('Authorization', this.bearerToken)

            const lengthPublicDirAfter = fs.readdirSync(this.directoryPublic).length
            expect(response).to.have.status(404)
            expect(response.body).to.deep.equals( { error: 'Resource not found' })
            expect(lengthPublicDirAfter).to.be.equal(lengthPublicDirBefore)
        })
    })
})