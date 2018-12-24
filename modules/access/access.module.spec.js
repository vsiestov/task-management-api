/*eslint no-invalid-this: off */
/*eslint no-unused-expressions: off */

const access = require('./access.module');
const expect = require('chai').expect;

describe('Access module tests', () => {

  const user = {
    _id: 'id',
    firstName: 'Valeriy',
    lastName: 'Valeriy',
    email: 'siestov.valeriy@gmail.com',
    password: 'password'
  };

  it('should generate hash', async () => {
    const hash = await access.generateHash('password');
    const compare = await access.compareHashed('password', hash);

    expect(compare).to.equal(true);
  });

  let token;

  it('should create user token', () => {
    token = access.createToken(user);

    expect(token).not.to.be.null;
  });

  const req = {
    query: {
    },
    headers: {
    },
    params: {
    },
    cookies: {
    },
    body: {
    }
  };

  it('should decode user token', () => {
    const result = access.checkToken(Object.assign({
    }, req, {
      query: {
        token
      }
    }));

    expect(result).not.to.have.property('password');
    expect(result.firstName).to.equal(user.firstName);
    expect(result.lastName).to.equal(user.lastName);
    expect(result.email).to.equal(user.email);
  });

  it('should verify token', (done) => {
    const request = Object.assign({
    }, req, {
      query: {
        token
      }
    });

    access.verifyToken(request, null, () => {

      expect(request.user.email).to.equal(user.email);

      done();
    });
  });

  it('should verify token and fail', (done) => {
    const request = Object.assign({
    }, req, {
      query: {
      }
    });

    access.verifyToken(request, {
      status: (status) => {
        expect(status).to.equal(401);

        return {
          send: (response) => {
            expect(response.errors[0].param).to.equal('token');
            done();
          }
        };
      }
    }, null);
  });
});
