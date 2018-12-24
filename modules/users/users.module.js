const Schema = require('./users.schema');
const Crud = require('../crud/crud.module');

class Users extends Crud {
}

module.exports = new Users(Schema);
