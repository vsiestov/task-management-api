/*eslint new-cap: off */

const mongoose = require('mongoose');

/**
 * @typedef {Object} IUser
 * @property {String} _id
 * @property {String} firstName
 * @property {String} lastName
 * @property {String} email
 * @property {String} password
 */

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

userSchema.index({
  email: 1
}, {
  unique: true
});

module.exports = mongoose.model('users', userSchema);
