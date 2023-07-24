const path = require("path");
const fsPromises = require("fs").promises;

const data = {};

const jsonfile = require("../model/employees.json");

data.employees = jsonfile.employees;

const getEmployees = (req, res) => {
  res.status(200).json(data.employees);
};

const createEmployee = (req, res) => {
  if (!req.body.firstName || !req.body.lastName) {
    console.log("something went wrong");
    res.status(400).json({
      message: "First and last name are required",
    });
  }

  data.employees.push({
    id: data.employees.length > 0 ? data.employees.length + 1 : 1,
    firstname: req.body.firstName.toString(),
    lastname: req.body.lastName.toString(),
  });

  let json = JSON.stringify(data);
  writeToFile(json);

  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  const employee = data.employees.find(
    (value) => value.id === parseInt(req.body.id)
  );
  if (!employee) {
    return res.status(400).json({
      message: `Employee ID ${req.body.id} not found`,
    });
  }

  console.log(employee);

  employee.firstname = req.body.firstname;
  employee.lastname = req.body.lastname;


  const filteredArray = data.employees.filter(
    (employee) => employee.id !== parseInt(req.body.id)
  );

  filteredArray.push(employee);

  data.employees = filteredArray.sort((a, b) =>
    a.id > b.id ? 1 : a.id < b.id ? -1 : 0
  );

  let json = JSON.stringify(data);
  writeToFile(json);

  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    (value) => value.id === parseInt(req.body.id)
  );
  if (!employee) {
    return res.status(400).json({
      message: `Employee ID ${req.body.id} not found`,
    });
  }

  console.log(employee);

  const filteredArray = data.employees.filter(
    (employee) => employee.id !== parseInt(req.body.id)
  );

  data.employees = filteredArray.sort((a, b) =>
    a.id > b.id ? 1 : a.id < b.id ? -1 : 0
  );

  let json = JSON.stringify(data);
  writeToFile(json);
  console.log(data.employees);

  res.json(data.employees);
};

const getEmployee = (req, res) => {
  console.log(req.params.id);
  const employee = data.employees.filter((e) => e.id === parseInt(req.params.id));
  if (!employee) {
    res.status(400).json({
      message: `Employee ID ${req.body.id} not found`,
    });
  }
  console.log(employee);

  res.status(200).json(employee);
};

function writeToFile(data) {
  fsPromises.writeFile(path.join(__dirname, "../model/employees.json"), data);
}

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
