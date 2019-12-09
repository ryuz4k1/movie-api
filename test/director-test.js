const chai = require('chai');
const chatHttp = require('chai-http');
const should = chai.should();
var expect = chai.expect;

const App = require('../src/app');
const app = new App().getApp();

chai.use(chatHttp);

let token, directorId;

describe('/api/directors', () => {
    before((done) => {
        chai.request(app).post('/authenticate')
        .send({username: "ryuz4k1", password: "123456"})
        .end((err, res) => {
            token = res.body.token;
            done();
        });
    });

    describe('/GET directors', () => {
        it('It should GET all directors', (done) => {
            chai.request(app)
            .get('/api/directors')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });
});

describe('/POST director', () => {
    it('It should POST a director', (done) => {
        const director = {
            name: 'Test director name',
            surname: 'Test director surname',
            bio: 'Test director bio'
        }
        chai.request(app)
        .post('/api/directors/add')
        .send(director)
        .set('x-access-token', token)
        .end((err, res) => {
            let bodyData = res.body.data;
            res.should.have.status(200);
            res.body.should.have.a('object');
            bodyData.should.have.property('name');
            bodyData.should.have.property('surname');
            bodyData.should.have.property('bio');
            directorId = bodyData._id;
            done();
        });
    });
});

describe('/GET/:directorId director', () => {
    it('It should GET a director by the given id', (done) => {
        chai.request(app)
        .get('/api/directors/' + directorId)
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.be.a('array');
            res.body.data[0].should.have.property('name');
            res.body.data[0].should.have.property('surname');
            res.body.data[0].should.have.property('bio');
            res.body.data[0].should.have.property('movies');
            done();
        });
    });
});

describe('/PUT/:directorId director', () => {
    it('it should UPDATE a movie given by id', (done) => {
        const director = {
            name: 'Test update director name',
            surname: 'Test update director surname',
            bio: 'Test update director bio'
        };
        chai.request(app)
            .put('/api/directors/edit/' + directorId)
            .send(director)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property('name').eql(director.name);
                res.body.data.should.have.property('surname').eql(director.surname);
                res.body.data.should.have.property('bio').eql(director.bio);
                done();
            });
    });
});


describe('/DELETE/:directorId director', () => {
    it('it should DELETE a movie given by id', (done) => {
        chai.request(app)
            .delete('/api/directors/delete/' + directorId)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});


