const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../app');

chai.use(chaiHttp);

let token, movieId;

describe('/api/movies Tests', () => {
    //Testler başlamadan önce yapmamız gereken işlemler varsa bunu kullanıyorum.
    before((done) => {
        chai.request(server).post('/authenticate').send({username: 'ryuz4k1', password: '123456'})
        .end((err, res) => {
            token = res.body.token;
            done();
        });
    });

    describe('/GET movies', () => {
        it('It should GET all movies', (done) => {
            chai.request(server).get('/api/movies').set('x-access-token', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
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

        chai.request(server)
        .post('/api/movies')
        .send(movie)
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('directorId');
            res.body.should.have.property('category');
            res.body.should.have.property('country');
            res.body.should.have.property('year');
            res.body.should.have.property('imdbScore');
            movieId = res.body._id;
            done();
        });
    });
});


describe('/GET/:movie_id movie', () => {
    it('it should GET a movie by the given id', (done) => {
        chai.request(server)
        .get('/api/movies/' + movieId)
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('directorId');
            res.body.should.have.property('category');
            res.body.should.have.property('country');
            res.body.should.have.property('year');
            res.body.should.have.property('imdbScore');
            res.body.should.have.property('_id').eql(movieId); //id property eşit olmalı test movieId sine
            done();
        });
    });
});


describe('/PUT/:movie_id movie', () => {
    it('it should UPDATE a movie given by id', (done) => {
        const movie = {
            title: '93creative',
            directorId: '5a34e1afb8523a78631f8541',
            category: 'Suç',
            country: 'Fransa',
            year: 1970,
            imdbScore: 9
        };

        chai.request(server)
        .put('/api/movies/' + movieId)
        .send(movie)
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title').eql(movie.title);
            res.body.should.have.property('directorId').eql(movie.directorId);
            res.body.should.have.property('category').eql(movie.category);
            res.body.should.have.property('country').eql(movie.country);
            res.body.should.have.property('year').eql(movie.year);
            res.body.should.have.property('imdbScore').eql(movie.imdbScore);

            done();
        });
    });
});


describe('/DELETE/:movie_id movie', () => {
    it('it should DELETE a movie given by id', (done) => {
        chai.request(server)
            .delete('/api/movies/' + movieId)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(1);
                done();
            });
    });
});



