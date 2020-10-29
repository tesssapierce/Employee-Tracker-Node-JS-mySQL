var inquirer = require("inquirer");
var mysql = require("mysql");
var Run = require("./run.js")

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysqlpassword",
  database: "employeedb"
});

connection.connect(function (err, res) {
  if (err) throw err;
  initialPrompt();
})

function initialPrompt() {
  console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - \n")
  console.log("Tessa's Employee Management System (TEMS) Copyright 2020")
  console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - -")
  inquirer.prompt(
    {
      type: "list",
      message: "What would you like to do?",
      name: "initial",
      choices: ["View", "Add", "Update", "Delete", "Done"]
    }
  ).then(function (answer) {
    switch (answer.initial) {
      case "Done" : connection.end()
        break
      default : switchBoard(answer.initial)
    }
  })
}

function switchBoard(action) {
  console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - -")
  console.log("Add new Departments, Roles, and Employees")
  inquirer.prompt(
    {
      type: "list",
      message: `What would you like to ${action}?`,
      name: "actionPrompt",
      choices: ["Department", "Role", "Employee", "Go Back"]
    }
  ).then(function (answer) {
    switch (true) {
      case (answer.actionPrompt == "Department" && action == "Add"): Run.newDepartment()
        break;
      case (answer.actionPrompt == "Department" && action === "Update") : Run.updateDepartment()
        break;
      case (answer.actionPrompt == "Department" && action === "Delete") : Run.deleteDepartment()
        break;
      case (answer.actionPrompt == "Department" && action === "View") : Run.viewDepartment()
        break;
      case (answer.actionPrompt == "Role" && action === "Add") : Run.newRole()
        break;
      case (answer.actionPrompt == "Role" && action === "Update") : Run.updateRole()
        break;
      case (answer.actionPrompt =="Role" && action === "Delete") : Run.deleteRole()
        break;
      case (answer.actionPrompt =="Role" && action === "View") : Run.viewRole()
        break;
      case (answer.actionPrompt =="Employee" && action === "Add") : Run.newEmployee()
        break;
      case (answer.actionPrompt == "Employee" && action === "Update") : Run.updateEmployee()
        break;
      case (answer.actionPrompt == "Employee" && action === "Delete") : Run.deleteEmployee()
        break;
      case (answer.actionPrompt == "Employee" && action === "View") : Run.viewEmployee()
        break;
      default: initialPrompt()
    }
  })
}