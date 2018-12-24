module.exports.codes = {
  UAUTHORIZED: 401,
  INVALID_ARGUMENTS: 422
};

module.exports.messages = {
  unauthorized: 'Authentication token is not provided',
  default: 'Something went wrong',
  success: 'Your request successfully completed',
  undefinedUser: 'User is not found',
  wrongPassword: 'Your email or password is invalid',
  invalid: {
    email: 'Your email is not valid',
    password: 'Password should have at least 6 characters',
    required: 'This field is required'
  }
};
