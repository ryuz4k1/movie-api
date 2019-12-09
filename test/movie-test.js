const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
var expect = chai.expect;

const App = require("../src/app");

const app = new App().getApp();

chai.use(chaiHttp);

let token, movieId;

describe('/api/movies Tests', () => {
    //Testler başlamadan önce yapmamız gereken işlemler varsa bunu kullanıyorum.
    before((done) => {
        chai.request(app).post('/authenticate')
        .send({username: "ryuz4k1", password: "123456"})
        .end((err, res) => {
            token = res.body.token;
            done();
        });
    });

    describe('/GET movies', () => {
        it('It should GET all movies', (done) => {
            chai.request(app).get('/api/movies').set('x-access-token', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });
});

describe('/POST movie', () => {
    it('it should POST a movie', (done) => {
        const movie = {
            title: 'Lost',
            directorId: '5ddbac6a711b4cb7dbe75823',
            category: 'Komedi',
            country: 'Türkiye',
            year: 1950,
            imdbScore: 8
        };

        chai.request(app)
        .post('/api/movies/add')
        .send(movie)
        .set('x-access-token', token)
        .end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.have.property('title');
            res.body.data.should.have.property('directorId');
            res.body.data.should.have.property('category');
            res.body.data.should.have.property('country');
            res.body.data.should.have.property('year');
            res.body.data.should.have.property('imdbScore');
            movieId = res.body.data._id;
            done();
        });
    });
});


describe('/GET/:movieId movie', () => {
    it('it should GET a movie by the given id', (done) => {
        chai.request(app)
        .get('/api/movies/' + movieId)
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.have.property('title');
            res.body.data.should.have.property('directorId');
            res.body.data.should.have.property('category');
            res.body.data.should.have.property('country');
            res.body.data.should.have.property('year');
            res.body.data.should.have.property('imdbScore');
           // res.body.should.have.property('_id').eql(movieId); //id property eşit olmalı test movieId sine
            done();
        });
    });
});


describe('/PUT/:movieId movie', () => {
    it('it should UPDATE a movie given by id', (done) => {
        const movie = {
            title: '123123qdqadqwd',
            directorId: '5ddbac6a711b4cb7dbe75823',
            category: 'Suç',
            country: 'Fransa',
            year: 1970,
            imdbScore: 9
        };
        chai.request(app)
            .put('/api/movies/edit/' + movieId)
            .send(movie)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property('title').eql(movie.title);
                res.body.data.should.have.property('directorId').eql(movie.directorId);
                res.body.data.should.have.property('category').eql(movie.category);
                res.body.data.should.have.property('country').eql(movie.country);
                res.body.data.should.have.property('year').eql(movie.year);
                res.body.data.should.have.property('imdbScore').eql(movie.imdbScore);

                done();
            });
    });
});


describe('/DELETE/:movieId movie', () => {
    it('it should DELETE a movie given by id', (done) => {
        chai.request(app)
            .delete('/api/movies/delete/' + movieId)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});



