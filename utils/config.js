module.exports = {
  // DB_CONSTANTS: dbConstants,
  JWT: {
    ACCESS_TOKEN: {
      ACCESS_SECRET_KEY: process.env.JWT_ACCESS_KEY,
      ACCESS_EXPIRY: process.env.ACCESS_EXPIRY,
    },

    REFRESH_TOKEN: {
      REFRESH_SECRET_KEY: process.env.JWT_REFRESH_KEY,
      REFRESH_EXPIRY: process.env.REFRESH_EXPIRY,
    },
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

  REDIS: {
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
  },
};
