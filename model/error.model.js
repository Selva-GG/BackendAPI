class APIError extends Error {
  constructor(message) {
    super(message);
    this.name = "APIError";
  }
}

export default class ErrorResponse extends APIError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

