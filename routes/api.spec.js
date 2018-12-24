/*eslint no-invalid-this: off */
/*eslint no-unused-expressions: off */

const supertest = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const api = supertest(app);

const helpers = require('../tests/helpers');

describe('Sign in/up tests', () => {

  const url = `/api/v1`;

  const user = {
    firstName: 'Valeriy',
    lastName: 'Valeriy',
    email: 'siestov.valeriy@gmail.com',
    password: 'password'
  };

  before(() => {
    return helpers.clear();
  });

  it('should sign up', () => {
    return api
      .post(`${url}/sign-up`)
      .send(user)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response).to.have.property('_id');
        expect(response).not.to.have.property('password');
        expect(response.token).not.to.be.undefined;
        expect(response.firstName).to.equal(user.firstName);
        expect(response.lastName).to.equal(user.lastName);
      });
  });

  it('should sign up with invalid params', () => {
    return api
      .post(`${url}/sign-up`)
      .send({
      })
      .set('Accept', 'application/json')
      .expect(422)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.errors[0].param).to.equal('firstName');
        expect(response.errors[2].param).to.equal('lastName');
        expect(response.errors[4].param).to.equal('email');
        expect(response.errors[6].param).to.equal('password');
      });
  });

  let loggedInUser;

  it('should sign in', () => {
    return api
      .post(`${url}/sign-in`)
      .send({
        email: user.email,
        password: user.password
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        loggedInUser = response;

        expect(response).to.have.property('_id');
        expect(response).not.to.have.property('password');
        expect(response.token).not.to.be.undefined;
        expect(response.firstName).to.equal(user.firstName);
        expect(response.lastName).to.equal(user.lastName);
      });
  });

  it('should check with wrong password', () => {
    return api
      .post(`${url}/sign-in`)
      .send({
        email: user.email,
        password: 'wrong'
      })
      .set('Accept', 'application/json')
      .expect(422)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.errors[0].param).to.equal('password');
      });
  });

  it('should check with wrong email', () => {
    return api
      .post(`${url}/sign-in`)
      .send({
        email: 'wrong@email',
        password: 'wrong'
      })
      .set('Accept', 'application/json')
      .expect(422)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.errors[0].param).to.equal('email');
      });
  });

  it('should check /me request', () => {
    return api
      .get(`${url}/me`)
      .set('x-access-token', loggedInUser.token)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response).to.have.property('_id');
        expect(response).not.to.have.property('password');
        expect(response.firstName).to.equal(user.firstName);
        expect(response.lastName).to.equal(user.lastName);
      });
  });

  it('should check /me request without token', () => {
    return api
      .get(`${url}/me`)
      .set('Accept', 'application/json')
      .expect(401)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.errors[0].param).to.equal('token');
      });
  });

});
