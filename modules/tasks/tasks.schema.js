/*eslint new-cap: off */

const mongoose = require('mongoose');

/**
 * @typedef {Object} ITask
 * @property {String} _id
 * @property {String} description
 * @property {Date} due
 * @property {ObjectId} userId
 */

const tasksSchema = mongoose.Schema({
  description: String,
  due: Date,
  userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('tasks', tasksSchema);
