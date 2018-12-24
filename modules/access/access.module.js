
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwtKey = process.env.JWT_KEY || 'accessjsonwebtokenkey';
const constants = require('../helpers/constants.module');
const messages = require('../helpers/messages.module');

/**
 * @typedef {Object} ITokenUser
 *
 * @property {String} _id
 * @property {String} email
 * @property {String} firstName
 * @property {String} lastName
 */

/**
 * Check user token and return user object or null
 *
 * @param {Object} req - Request object
 * @returns {ITokenUser|null} - result of verification
 */
const checkToken = (req) => {
  const token =
    req.headers['x-access-token'] ||
    req.query.token ||
    req.params.token ||
    req.cookies.token ||
    req.body.token;

  if (token) {

    return jwt.verify(token, jwtKey, (err, decoded) => {

      if (err) {
        return null;
      }

      return decoded;
    });
  }

  return null;
};

/**
 * Verify user's token
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - next function
 * @returns {*} - Callback execution
 */
const verifyToken = (req, res, next) => {
  const user = checkToken(req);
  const requestMessages = constants.messages;

  if (!user) {
    return res
      .status(constants.codes.UAUTHORIZED)
      .send(messages.error(requestMessages.unauthorized, 'token', 'header'));
  }

  req.user = user;

  return next();
};

/**
 * Generate new hash from incoming word
 *
 * @param {String} word - String for hashing
 * @returns {Promise<String>} - Result of hashing
 */
const generateHash = (word) => {
  return bcrypt.genSalt(8)
    .then((salt) => {
      return bcrypt.hash(word, salt);
    });
};

/**
 * Compare hash with incoming word
 *
 * @param {String} compare - Hashed string
 * @param {String} password - Pure password
 * @returns {Promise<Boolean>} - Result of hashing
 */
const compareHashed = (compare, password) => {
  return bcrypt.compare(compare, password);
};

/**
 * Generate user token
 *
 * @param {IUser} user - User object
 * @returns {String} - Token string
 */
const createToken = (user) => {
  return jwt.sign(_.pick(user, '_id', 'firstName', 'lastName', 'email'), jwtKey, {
    expiresIn: '1w'
  });
};

module.exports = {
  checkToken,
  verifyToken,
  generateHash,
  compareHashed,
  createToken
};
