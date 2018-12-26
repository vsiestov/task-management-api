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
  userExists: 'Users with this email already exists',
  undefinedRecord: 'Requested record is not found',
  updateProblem: 'Cannot update this item',
  invalid: {
    email: 'Your email is not valid',
    password: 'Password should have at least 6 characters',
    required: 'This field is required',
    description: 'Description is required field and must include at least 10 characters',
    due: 'You provided incorrect value for due date',
    identity: 'Identity of this entity is not correct'
  }
};
