class ApiError extends Error {
  constructor(code, status, message) {
    super(message);
    this.code = code;
    this.status = status;
    this.success = false;
  }

  static notFound(message) {
    return new ApiError(404, "Not Found", message);
  }

  static badRequest(message) {
    return new ApiError(400, "Bad Request", message);
  }

  static unauthorized(message, details = null) {
    return new ApiError(401, "Unauthorized", message, details);
  }

  static internalServerError(message) {
    return new ApiError(500, "Internal Server Error", message);
  }

  static conflict(message, details = null) {
    return new ApiError(409, 'Conflict', message, details);
  }
}

module.exports = ApiError;
