const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const User = require('../models/User');
const { user, newUser, hashedPassword } = require('./utils');

describe('====> USER WORKFLOW TEST', function () {
  before(async () => {
    count = await User.count();
  });

  let token;
  let deleteUserToken;
  let count;

  it('Should log in user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end(function (err, res) {
        token = res.body.token;
        // console.log(res.body);

        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(err).to.be.equal(null);
        done();
      });
  });

  it.skip('Log out user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/logout')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const userId = res.body.msg.split(' ');

        expect(res.status).to.be.equal(200);
        expect(res.body.msg).to.be.a('string');
        expect(userId[5].length).to.be.equal(36);
        expect(userId[5]).to.be.equal(user.userId);

        done();
      });
  });

  it.skip('Should get all users', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/admin/allusers')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(5);
        count = res.body.data.length;

        done();
      });
  });

  it.skip('Should get a single user', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/getme')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.userId).to.be.equal(user.userId);
        done();
      });
  });

  it('Register a new user', (done) => {
    chai
      .request(server)
      .post('/api/v1/users')
      .send(newUser)
      .end((err, res) => {
        deleteUserToken = res.body.token;
        expect(res.status).to.be.equal(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.password.length).to.be.equal(60);
        expect(res.body.data.email).to.include('@');
        expect(res.body.data.email).to.include(['.com']);

        done();
      });
  });

  it('Update a user', (done) => {
    chai
      .request(server)
      .put('/api/v1/users/updateme')
      .set({ Authorization: `Bearer ${deleteUserToken}` })
      .send({ firstName: 'Sam-Updated', city: 'Charlotte-Updated' })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.firstName).to.be.equal('Sam-Updated');
        expect(res.body.data.city).to.be.equal('Charlotte-Updated');
        done();
      });
  });

  it('Delete a user', (done) => {
    chai
      .request(server)
      .delete('/api/v1/users/deleteme')
      .set({ Authorization: `Bearer ${deleteUserToken}` })
      .end((err, res) => {
        console.log(res.body.msg);
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.msg).to.be.equal(
          `User with the id ${newUser.userId} was deleted`
        );
        console.log(count);
        done();
      });
  });

  it.skip('Check if user password is stored salted and hashed ', async () => {
    const savedUser = await User.scope('withPassword').findOne({
      where: { email: user.email },
    });

    expect(savedUser.dataValues.password.length).to.be.equal(60);
    expect(savedUser.dataValues.password).to.be.equal(hashedPassword);
  });
});
