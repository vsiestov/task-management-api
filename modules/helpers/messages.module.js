const constants = require('./constants.module');

module.exports.error = (msg = constants.messages.default, param, location) => {
  return {
    errors: [
      {
        param,
        location,
        msg
      }
    ]
  };
};

module.exports.success = (msg = constants.messages.success) => {
  return {
    message: msg
  };
};
