const { HTTP_STATUS_CODES } = require("../utils/config");

const success = (res, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.OK).send(response);
};

const created = (res, message, data = null) => {
  const response = {
    success: true,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.CREATED).send(response);
};

const accepted = (res, message, data = null) => {
  const response = {
    success: true,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.ACCEPTED).send(response);
};

const noContent = (res, message) => {
  const response = {
    success: true,
    message,
  };
  res.status(HTTP_STATUS_CODES.NO_CONTENT).send(response);
};

const badRequest = (res, message, data = null) => {
  const response = {
    success: false,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(response);
};

const unauthorized = (res, message, data = null) => {
  const response = {
    success: false,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send(response);
};

const forbidden = (res, message, data = null) => {
  const response = {
    success: false,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.FORBIDDEN).send(response);
};

const notFound = (res, message, data = null) => {
  const response = {
    success: false,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.NOT_FOUND).send(response);
};

const unprocessableEntity = (res, message, data = null) => {
  const response = {
    success: false,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).send(response);
};

const TooManyRequests = (res, message, data = null) => {
  const response = {
    success: false,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.TOO_MANY_REQUESTS).send(response);
};

const internalServerError = (res, message, data = null) => {
  const response = {
    success: false,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(response);
};

const badGateway = (res, message, data = null) => {
  const response = {
    success: false,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.BAD_GATEWAY).send(response);
};

const serviceUnavailable = (res, message, data = null) => {
  const response = {
    success: false,
    message,
  };
  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.SERVICE_UNAVAILABLE).send(response);
};

module.exports = {
  success,
  created,
  accepted,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  unprocessableEntity,
  TooManyRequests,
  internalServerError,
  badGateway,
  serviceUnavailable,
};
