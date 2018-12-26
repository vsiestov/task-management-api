/*eslint new-cap: off */

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const constants = require('../modules/helpers/constants.module');
const validation = require('../modules/helpers/validation.module');
const users = require('../modules/users/users.module');
const access = require('../modules/access/access.module');
const messages = require('../modules/helpers/messages.module');

router.get('/me', access.verifyToken, (req, res) => {
  res.send(req.user);
});

router.post('/sign-in', validation.endpoints.signIn, validation.check, async (req, res, next) => {
  const body = req.body;

  const user = await users.findOne({
    email: body.email
  });

  if (!user) {
    return next(messages.error(constants.messages.undefinedUser));
  }

  if (!await access.compareHashed(body.password, user.password)) {
    return next(messages.error(constants.messages.wrongPassword));
  }

  user.token = access.createToken(user);

  return res.send(_.omit(user, ['password']));
});

router.post('/sign-up', validation.endpoints.signUp, validation.check, async (req, res, next) => {
  const body = req.body;

  const registered = await users.findOne({
    email: body.email
  });

  if (registered) {
    return next(messages.error(constants.messages.userExists));
  }

  const user = await users.create(Object.assign({
  }, body, {
    password: await access.generateHash(body.password)
  }));

  user.token = access.createToken(user);

  return res.send(_.omit(user, ['password']));
});

module.exports = router;
