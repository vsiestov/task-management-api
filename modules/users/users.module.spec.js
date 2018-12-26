const users = require('./users.module');
const helpers = require('../../tests/helpers');
const expect = require('chai').expect;

describe('Users testing module', () => {

  before(() => {
    helpers.clear();
  });

  const userData = {
    firstName: 'Valeriy',
    lastName: 'Siestov',
    email: 'siestov.valeriy@gmail.com',
    password: 'password'
  };

  let item;

  it('should create a user', async () => {
    const user = await users.create(userData);

    item = user;

    expect(user.firstName).to.equal(userData.firstName);
    expect(user.lastName).to.equal(userData.lastName);
    expect(user.email).to.equal(userData.email);
    expect(user).to.have.property('_id');
  });

  it('should update a user', async () => {
    const result = await users.update({
      _id: item._id
    }, {
      email: 'valeriy.siestov@frondevo.com'
    });

    expect(result.length).to.equal(1);
    expect(result[0].email).to.equal('valeriy.siestov@frondevo.com');
  });

  it('should find a user', async () => {
    const user = await users.findOne({
      _id: item._id
    });

    expect(user.firstName).to.equal(userData.firstName);
    expect(user.lastName).to.equal(userData.lastName);
    expect(user.email).to.equal('valeriy.siestov@frondevo.com');
  });

  it('should fetch the list user', async () => {
    const list = await users.find();

    expect(list.length).to.equal(1);
  });

  it('should delete a user', async () => {
    const result = await users.remove({
      _id: item._id
    });

    expect(result.n).to.equal(1);

    const list = await users.find();

    expect(list.length).to.equal(0);

  });
});

