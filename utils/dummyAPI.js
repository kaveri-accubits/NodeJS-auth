const axios = require("axios");
const responseUtil = require("../utils/response");
const responseMessage = require("../utils/responseMessage");
const baseUrl = process.env.DUMMY_API_BASE_URL;

//get all employees
const getAllEmployees = async (req, res) => {
  await axios
    .get(`${baseUrl}/employees`)
    .then((result) => {
      let employees = result.data.data;
      let data = {
        employees,
      };

      console.log("result", result);
      return responseUtil.success(res, responseMessage.user.success, data);
    })
    .catch((error) => {
      return responseUtil.internalServerError(
        res,
        responseMessage.error.failed,
        error
      );
    });
};

// Get a single employee data
const getEmployeeById = async (req, res) => {
  const id = req.params.id;
  await axios
    .get(`${baseUrl}/employee/1`)
    .then((result) => {
      let employees = result.data.data;
      let data = {
        employees,
      };
      console.log("result", result.data);

      return responseUtil.success(res, responseMessage.user.success, data);
    })
    .catch((error) => {
      return responseUtil.internalServerError(
        res,
        responseMessage.error.failed,
        error
      );
    });
};

// Create new record in database
const createEmployee = async (req, res) => {
  const data = req.body;
  await axios
    .post(`${baseUrl}/create`)
    .then((result) => {
      let employees = result.data.data;
      let data = {
        employees,
      };
      return responseUtil.success(res, responseMessage.user.registered, data);
    })
    .catch((error) => {
      return responseUtil.internalServerError(
        res,
        responseMessage.error.errorRegistering,
        error
      );
    });
};

//Update an employee record
const updateEmployee = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  await axios
    .put(`${baseUrl}/update/21/`)
    .then((result) => {
      let employees = result.data.data;
      let data = {
        employees,
      };
      return responseUtil.success(res, responseMessage.user.userUpdated, data);
    })
    .catch((error) => {
      return responseUtil.internalServerError(
        res,
        responseMessage.error.failed,
        error
      );
    });
};

//Delete an employee record
const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  await axios
    .delete(`${baseUrl}/delete/2/`)
    .then((result) => {
      let employees = result.data.data;
      let data = {
        employees,
      };
      return responseUtil.success(res, responseMessage.user.delete, data);
    })
    .catch((error) => {
      return responseUtil.internalServerError(
        res,
        responseMessage.error.failed,
        error
      );
    });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
