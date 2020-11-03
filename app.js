var inquirer = require("inquirer");
var mysql = require("mysql");

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
      case (answer.actionPrompt == "Department" && action == "Add"): newDepartment()
        break;
      case (answer.actionPrompt == "Department" && action === "Update") : updateDepartment()
        break;
      case (answer.actionPrompt == "Department" && action === "Delete") : deleteDepartment()
        break;
      case (answer.actionPrompt == "Department" && action === "View") : viewDepartment()
        break;
      case (answer.actionPrompt == "Role" && action === "Add") : newRole()
        break;
      case (answer.actionPrompt == "Role" && action === "Update") : updateRole()
        break;
      case (answer.actionPrompt =="Role" && action === "Delete") : deleteRole()
        break;
      case (answer.actionPrompt =="Role" && action === "View") : viewRole()
        break;
      case (answer.actionPrompt =="Employee" && action === "Add") : newEmployee()
        break;
      case (answer.actionPrompt == "Employee" && action === "Update") : updateEmployee()
        break;
      case (answer.actionPrompt == "Employee" && action === "Delete") : deleteEmployee()
        break;
      case (answer.actionPrompt == "Employee" && action === "View") : viewEmployee()
        break;
      default: initialPrompt()
    }
  })
}

  function newDepartment() {
    inquirer.prompt({
      type: "input",
      message: "What is the name of the new department?",
      name: "newDepartment"
    }).then(function (answer) {
      connection.query("INSERT INTO department SET ?", { department_name: answer.newDepartment }, function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " department inserted! \n")
        inquirer.prompt({
          type: "list",
          message: "Would you like to add another department?",
          name: "newDeptSwitch",
          choices: ["Yes", "No"]
        }).then(function (answer) {
          switch (answer.newDeptSwitch) {
            case "Yes": newDepartment()
              break;
            default: initialPrompt()
          }
        })
      })
    })
  }
  function updateDepartment() {
    connection.query("SELECT department_name FROM department", function(err,res){
      if (err) throw err;
      let currentDepartments = []
      res.forEach(department => {currentDepartments.push(department.department_name)})
      inquirer.prompt({
        type: "list",
        message: "Which department do you want to update?",
        name: "departmentUpdate",
        choices: currentDepartments
      }).then(function(answer){
        var oldDepartmentName = answer.departmentUpdate
        inquirer.prompt({
          type: "input",
          message: `What would you like to change ${oldDepartmentName} to?`,
          name: "departmentNew"
        }).then(function(answer){
          var newDepartmentName = answer.departmentNew
          connection.query("UPDATE department SET ? WHERE ?",[{department_name: newDepartmentName},{department_name: oldDepartmentName}], function(err,res){
            if (err) throw err;
            console.log(res.affectedRows + " department(s) updated! \n")
            inquirer.prompt({
              type: "list",
              message: "Would you like to make any other updates to Departments?",
              name: "updateDeptSwitch",
              choices: ["Yes", "No"]
            }).then(function(answer){
              switch(answer.updateDeptSwitch){
                case "Yes" : updateDepartment()
                  break;
                default : initialPrompt()
              }
            }).catch(function(err){
              console.log(err)
            })
          })
        })
      })
    })
  }
  function viewDepartment() {
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      console.log("Loading current departments...")
      console.table(res)
      initialPrompt();
    })
  }
  function deleteDepartment() {
    connection.query("SELECT department_name FROM department", function(err,res){
      if (err) throw err;
      let currentDepartments = []
      res.forEach(department => {currentDepartments.push(department.department_name)})
      inquirer.prompt({
        type: "list",
        message: "Which department do you want to delete?",
        name: "departmentDelete",
        choices: currentDepartments
      }).then(function(answer){
          var deleteDepartment = answer.departmentDelete
          connection.query("DELETE FROM department WHERE ?", {department_name: deleteDepartment}, function(err,res){
            if (err) throw err;
            console.log(res.affectedRows + " department named " + deleteDepartment + " deleted!\n");
            inquirer.prompt({
              type: "list",
              message: "Would you like to delete another department?",
              name: "deleteDeptSwitch",
              choices: ["Yes", "No"]
            }).then(function(answer){
              switch(answer.deleteDeptSwitch){
                case "Yes" : deleteDepartment()
                  break;
                default : initialPrompt()
              }
            })
          })
      })
    })
  }
  function newRole(){
    connection.query("SELECT * FROM department", function(err,res){
      var departments = []
      res.forEach(department => departments.push(department.id + " - " + department.department_name))
      inquirer.prompt([
        {
          type: "input",
          message: "What is the name of the new role?",
          name: "roleTitle"
        },
        {
          type: "input",
          message: "What is the Salary for this role?",
          name: "roleSalary"
        },
        {
          type: "list",
          message: "What is the department this is associated with?",
          name: "roleDepartment",
          choices: departments
        }
    ]).then(function (answer) {
        var roleTitle = answer.roleTitle;
        var roleSalary = parseInt(answer.roleSalary);
        var roleDepartment = parseInt(answer.roleDepartment);
        connection.query("INSERT INTO role SET ?", {title: roleTitle, salary: roleSalary, department_id: roleDepartment}, function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " role inserted! \n")
          inquirer.prompt({
            type: "list",
            message: "Would you like to add another role?",
            name: "newRoleSwitch",
            choices: ["Yes", "No"]
          }).then(function (answer) {
            switch (answer.newRoleSwitch) {
              case "Yes": newRole()
                break;
              default: initialPrompt()
            }
          })
        })
      })
    })
  }
  function updateRole(){
    connection.query("SELECT title FROM role", function(err,res){
      if (err) throw err;
      let currentRoles = []
      res.forEach(role => {currentRoles.push(role.title)})
      inquirer.prompt({
        type: "list",
        message: "Which role do you want to update?",
        name: "roleUpdate",
        choices: currentRoles
      }).then(function(answer){
        var oldRoleName = answer.roleUpdate
        inquirer.prompt({
          type: "list",
          message: `What would you like to change about ${oldRoleName}?`,
          name: "roleChange",
          choices: ["Title", "Salary", "Department ID"]
        }).then(function(answer){
          var change = answer.roleChange;
          inquirer.prompt({
            type: "input",
            message: `What would you like to change ${change} of ${oldRoleName} to?`,
            name: "roleUpdateNew"
          }).then(function(answer){
            var newValue = answer.roleUpdateNew;
            connection.query("UPDATE role SET ? WHERE ?",[{[change.toLowerCase()]: newValue},{title: oldRoleName}], function(err,res){
              if (err) throw err;
              console.log(res.affectedRows + " role(s) updated! \n")
              inquirer.prompt({
                type: "list",
                message: "Would you like to make any other updates to Roles?",
                name: "updateRolesSwitch",
                choices: ["Yes", "No"]
              }).then(function(answer){
                switch(answer.updateRolesSwitch){
                  case "Yes" : updateRole()
                    break;
                  default : initialPrompt()
                }
              }).catch(function(err){
                console.log(err)
              })
            })
          })
        })
      })
    }) 
  }
  function viewRole(){
    connection.query("SELECT role.title, role.salary, department.department_name FROM role INNER JOIN department ON role.department_id = department.id", function (err, res) {
      if (err) throw err;
      console.log("Loading current roles...")
      console.table(res)
    initialPrompt();
    })    
  }
  function deleteRole(){
    connection.query("SELECT title FROM role", function(err,res){
      if (err) throw err;
      let roles = []
      res.forEach(role => {roles.push(role.title)})
      inquirer.prompt({
        type: "list",
        message: "Which department do you want to delete?",
        name: "roleDelete",
        choices: roles
      }).then(function(answer){
          var deleteRole = answer.roleDelete
          connection.query("DELETE FROM role WHERE ?", {title: deleteRole}, function(err,res){
            if (err) throw err;
            console.log(res.affectedRows + " role(s) named " + deleteRole + " deleted!\n");
            inquirer.prompt({
              type: "list",
              message: "Would you like to delete another roles?",
              name: "deleteRoleSwitch",
              choices: ["Yes", "No"]
            }).then(function(answer){
              switch(answer.deleteRoleSwitch){
                case "Yes" : deleteRole()
                  break;
                default : initialPrompt()
              }
            })
          })
      })
    })
  }
  function newEmployee(){
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.id, role.title FROM employee INNER JOIN role ON employee.role_id = role.id", function(err,res){
      var managers = []
      res.forEach(employee => managers.push(employee.id + " - " + employee.first_name + " " + employee.last_name))
      var roles = []
      res.forEach(role => roles.push(role.id + " - " + role.title))
      inquirer.prompt([
        {
          type: "input",
          message: "What is the first name of the new employee?",
          name: "employeeFirstName"
        },
        {
          type: "input",
          message: "What is last name of the new employee?",
          name: "employeeLastName"
        },
        {
          type: "list",
          message: "What is this employee's role?",
          name: "employeeRole",
          choices: roles
        },
        {
          type: "list",
          message: "Who is this employee's Manager?",
          name: "employeeManager",
          choices: managers
        }
    ]).then(function (answer) {
        var employeeFN = answer.employeeFirstName;
        var employeeLN = answer.employeeLastName;
        var employeeRole = parseInt(answer.employeeRole);
        var employeeManager = parseInt(answer.employeeManager);
        connection.query("INSERT INTO employee SET ?", {first_name: employeeFN, last_name: employeeLN, role_id: employeeRole, manager_id: employeeManager}, function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " role inserted! \n")
          inquirer.prompt({
            type: "list",
            message: "Would you like to add another Employee?",
            name: "newEmployeeSwitch",
            choices: ["Yes", "No"]
          }).then(function (answer) {
            switch (answer.newEmployeeSwitch) {
              case "Yes": newEmployee()
                break;
              default: initialPrompt()
            }
          })
        })
      })
    })
  }
  function updateEmployee(){
    connection.query("SELECT id, first_name, last_name FROM employee", function(err,res){
      if (err) throw err;
      let employees = []
      res.forEach(employee => {employees.push(employee.id + " - " + employee.first_name + " " + employee.last_name)})
      inquirer.prompt({
        type: "list",
        message: "Which employee do you want to update?",
        name: "employeeUpdate",
        choices: employees
      }).then(function(answer){
        var employeeName = answer.employeeUpdate
        inquirer.prompt({
          type: "list",
          message: `What would you like to change about ${employeeName}?`,
          name: "employeeChange",
          choices: ["First Name", "Last Name", "Role ID", "Manager ID"]
        }).then(function(answer){
          var change = answer.employeeChange.toLowerCase().replace(/ /g,"_");
          console.log(change)
          inquirer.prompt({
            type: "input",
            message: `What would you like to change the ${change} of ${employeeName} to?`,
            name: "employeeUpdateNew"
          }).then(function(answer){
            var newValue = answer.employeeUpdateNew;
            var employeeID = parseInt(employeeName);
            connection.query("UPDATE employee SET ? WHERE ?",[{[change]: newValue},{id: employeeID}], function(err,res){
              if (err) throw err;
              console.log(res.affectedRows + " employee(s) updated! \n")
              inquirer.prompt({
                type: "list",
                message: "Would you like to make any other updates to Employees?",
                name: "updateEmployeeSwitch",
                choices: ["Yes", "No"]
              }).then(function(answer){
                switch(answer.updateEmployeeSwitch){
                  case "Yes" : updateEmployee()
                    break;
                  default : initialPrompt()
                }
              }).catch(function(err){
                console.log(err)
              })
            })
          })
        })
      })
    })  
  }
  function viewEmployee() {
    console.log("Loading all employees...")
    connection.query("SELECT employee.id, department.department_name AS department, role.title, employee.first_name, employee.last_name, manager.first_name AS manager_first, manager.last_name AS manager_last, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id", function (err, res) {
      if (err) throw err;
      console.table(res)
      initialPrompt();
    })
  }
  function deleteEmployee() {
    connection.query("SELECT id, first_name, last_name FROM employee", function(err,res){
      if (err) throw err;
      let employees = []
      res.forEach(employee => {employees.push(employee.id + " - " + employee.first_name + " " + employee.last_name)})
      inquirer.prompt({
        type: "list",
        message: "Which employee do you want to delete?",
        name: "employeeDelete",
        choices: employees
      }).then(function(answer){
          var employeeID = parseInt(answer.employeeDelete)
          connection.query("DELETE FROM employee WHERE ?", {id: employeeID}, function(err,res){
            if (err) throw err;
            console.log(res.affectedRows + " employee(s) named " + answer.employeeDelete + " deleted!\n");
            inquirer.prompt({
              type: "list",
              message: "Would you like to delete another employee?",
              name: "deleteEmployeeSwitch",
              choices: ["Yes", "No"]
            }).then(function(answer){
              switch(answer.deleteEmployeeSwitch){
                case "Yes" : deleteEmployee()
                  break;
                default : initialPrompt()
              }
            })
          })
      })
    })
  }