/* eslint-disable */
process.env.NODE_ENV = 'test';
require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

const Worker = require('../src/models/worker');
const Consumer = require('../src/models/consumer');

chai.use(chaiHttp);

describe('Pro-Chores APIs Testing', () => {
  describe('Testing for welcome message', () => {
    it('it should GET a welcome message', (done) => {
      chai.request(server)
        .get('/api')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.message.should.eql('Welcome to Pro-Chores API');
          done();
        });
    });
  });

  describe('Testing for Registering Consumer', () => {
    it('it registers a new consumer', (done) => {
      chai.request(server)
        .post('/api/consumer')
        .send({
          email: 'test@gmail.com',
          password: 'Abcd@1234'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.message.should.eql('New Consumer Successfuly Created');
          done();
        });
    });
    after(async () => {
      await Consumer.deleteOne({ email: 'test@gmail.com' });
    })
  });

  describe('Testing for Registering Worker', () => {
    it('it registers a new worker', (done) => {
      chai.request(server)
        .post('/api/worker')
        .send({
          email: 'test@gmail.com',
          password: 'Abcd@1234'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.message.should.eql('New Worker Successfuly Created');
          done();
        });
    });
    after(async () => {
      await Worker.deleteOne({ email: 'test@gmail.com' });
    })
  });
});