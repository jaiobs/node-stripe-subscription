const httpStatus = require('http-status');
const ExtendableError = require('./extendableError');

class ApiError extends ExtendableError {
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status);
  }
}

module.exports = ApiError;
