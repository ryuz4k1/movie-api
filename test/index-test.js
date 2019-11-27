const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const App = require("../src/app");

const app = new App().getApp();

chai.use(chaiHttp);


describe('Node Server', () => {
    it('(GET / index page)', (done) =>{
        chai.request(app).get('/').end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});
