const responseUtil = require("../utils/response");
const responseMessage = require("../utils/responseMessage");
const { validationResult } = require("express-validator");

const validate = (validations) => async (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return responseUtil.unprocessableEntity(
    res,
    responseMessage.error.unprocessableEntity,
    errors.array()
  );
};

module.exports = { validate };
