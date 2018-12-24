const {
  check,
  validationResult
} = require('express-validator/check');
const constants = require('./constants.module');

const validationFields = {
  required: {
    email: check('email')
      .trim()
      .exists()
      .isEmail()
      .normalizeEmail({
        lowercase: true
      })
      .withMessage(constants.messages.invalid.email),
    password: check('password')
      .exists()
      .isLength({
        min: 6
      })
      .withMessage(constants.messages.invalid.password),
    firstName: check('firstName')
      .exists()
      .trim()
      .isLength({
        min: 1
      })
      .withMessage(constants.messages.invalid.required),
    lastName: check('lastName')
      .exists()
      .trim()
      .isLength({
        min: 1
      })
      .withMessage(constants.messages.invalid.required)
  }
};

const endpoints = {
  signIn: [
    validationFields.required.email,
    validationFields.required.password
  ],
  signUp: [
    validationFields.required.firstName,
    validationFields.required.lastName,
    validationFields.required.email,
    validationFields.required.password
  ]
};

module.exports = {
  check: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      return res.status(422).json({
        errors: errors.array()
      });
    }

    return next();
  },
  endpoints
};
