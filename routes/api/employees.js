const express = require("express");
const router = express.Router();
const path = require("path");
const fsPromises = require("fs").promises;

const controller = require("../../controllers/employeeController");

const data = {};

const jsonfile = require("../../model/employees.json");

data.employees = jsonfile.employees;

router
  .route("/")
  .get(controller.getEmployees)
  .post(controller.createEmployee)
  .put(controller.updateEmployee)
  .delete(controller.deleteEmployee);

router.route("/:id").get(controller.getEmployee);

function writeToFile(data) {
  fsPromises.writeFile(
    path.join(__dirname, "..", "..", "/data/employees.json"),
    data
  );
}

module.exports = router;
