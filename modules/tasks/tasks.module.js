const Schema = require('./tasks.schema');
const Crud = require('../crud/crud.module');

class Tasks extends Crud {
}

module.exports = new Tasks(Schema);
