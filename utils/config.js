module.exports = {
  // DB_CONSTANTS: dbConstants,
  JWT: {
    SECRET_KEY: process.env.JWT_KEY,
  },
  HTTP_STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
  },

  USER: {
    TYPE: {
      admin: 1,
      user: 2,
    },
  },
};
