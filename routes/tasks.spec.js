/*eslint no-invalid-this: off */
/*eslint no-unused-expressions: off */

const supertest = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const api = supertest(app);

const helpers = require('../tests/helpers');

describe('Task endpoints tests', () => {
  const url = `/api/v1`;

  before(() => {
    return helpers.clear();
  });

  let user;

  before(() => {
    return api
      .post(`${url}/sign-up`)
      .send({
        firstName: 'Valeriy',
        lastName: 'Valeriy',
        email: 'siestov.valeriy@gmail.com',
        password: 'password'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        user = response;
      });
  });

  let task;

  it('should create a task for this user', () => {
    return api
      .post(`${url}/tasks`)
      .set('Accept', 'application/json')
      .set('x-access-token', user.token)
      .send({
        description: 'Implement backend API',
        due: new Date().getTime()
      })
      .expect(200)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.description).to.equal('Implement backend API');
        expect(response.userId).to.equal(user._id);
        expect(response.due).not.to.be.null;

        task = response;
      });
  });

  it('should return the list of tasks for this user', () => {
    return api
      .get(`${url}/tasks`)
      .set('Accept', 'application/json')
      .set('x-access-token', user.token)
      .expect(200)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response).to.be.an('Array');
        expect(response.length).to.equal(1);
      });
  });

  it('should update a task for this user', () => {
    return api
      .put(`${url}/tasks/${task._id}`)
      .set('Accept', 'application/json')
      .set('x-access-token', user.token)
      .send({
        description: 'Implement frontend application'
      })
      .expect(200)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.description).to.equal('Implement frontend application');
        expect(response.userId).to.equal(user._id);
        expect(response.due).not.to.be.null;
      });
  });

  it('should try to update with no arguments', () => {
    return api
      .put(`${url}/tasks/${task._id}`)
      .set('Accept', 'application/json')
      .set('x-access-token', user.token)
      .expect(422);
  });

  it('should get task by its identity', () => {
    return api
      .get(`${url}/tasks/${task._id}`)
      .set('Accept', 'application/json')
      .set('x-access-token', user.token)
      .expect(200)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.description).to.equal('Implement frontend application');
        expect(response.userId).to.equal(user._id);
        expect(response.due).not.to.be.null;
      });
  });

  it('should try to get a task with incorrect identity', () => {
    return api
      .get(`${url}/tasks/incorrect-id`)
      .set('Accept', 'application/json')
      .set('x-access-token', user.token)
      .expect(422)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.errors[0].param).to.equal('id');
      });
  });

  it('should remove the create task', () => {
    return api
      .delete(`${url}/tasks/${task._id}`)
      .set('Accept', 'application/json')
      .set('x-access-token', user.token)
      .expect(200)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.message).to.equal('Your request successfully completed');

        return api
          .get(`${url}/tasks`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .expect(200)
          .then((response) => {
            return response.body;
          })
          .then((response) => {
            expect(response).to.be.an('Array');
            expect(response.length).to.equal(0);
          });
      });
  });

  it('should create a task with wrong attributes', () => {
    return api
      .post(`${url}/tasks`)
      .set('Accept', 'application/json')
      .set('x-access-token', user.token)
      .send({
        description: 'Small',
        due: 'string'
      })
      .expect(422)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.errors[0].param).to.equal('description');
        expect(response.errors[1].param).to.equal('due');
      });
  });

  it('should try to get a deleted task', () => {
    return api
      .get(`${url}/tasks/${task._id}`)
      .set('Accept', 'application/json')
      .set('x-access-token', user.token)
      .expect(422)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.errors[0].msg).to.equal('Requested record is not found');
        expect(response.errors[0].param).to.equal('id');
      });
  });

  it('should try to update with no arguments and deleted task', () => {
    return api
      .put(`${url}/tasks/${task._id}`)
      .set('Accept', 'application/json')
      .set('x-access-token', user.token)
      .expect(422)
      .then((response) => {
        return response.body;
      })
      .then((response) => {
        expect(response.errors[0].msg).to.equal('Cannot update this item');
      });
  });
});
