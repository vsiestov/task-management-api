const mongoose = require('mongoose');

require('dotenv-flow').config();

const users = require('../modules/users/users.schema');
const tasks = require('../modules/tasks/tasks.schema');

mongoose.connect(process.env.DB_PATH, {
  useNewUrlParser: true
});

module.exports = {
  clear: async () => {
    await users.deleteMany({
    });
    await tasks.deleteMany({
    });
  }
};
