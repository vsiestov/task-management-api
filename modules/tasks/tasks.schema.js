/*eslint new-cap: off */

const mongoose = require('mongoose');

/**
 * @typedef {Object} ITask
 * @property {String} _id
 * @property {String} description
 * @property {Date} due
 */

const tasksSchema = mongoose.Schema({
  description: String,
  due: Date
});

module.exports = mongoose.model('tasks', tasksSchema);