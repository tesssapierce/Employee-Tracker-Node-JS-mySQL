var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysqlpassword",
  database: "employeedb"
});

class Run {
  newDepartment() {
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
            case "No": initialPrompt()
          }
        })
      })
    })
  }
  viewDepartment() {
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      console.log("Loading current departments...")
      console.table(res)
    })
  }
  updateDepartment() {
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
            })
          })
        })
      })
    })
  }
  viewEmployee() {
    console.log("Loading all employees...")
    connection.query("SELECT employee.id, department.department_name AS department, role.title, employee.first_name, employee.last_name, manager.first_name AS manager_first, manager.last_name AS manager_last, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id", function (err, res) {
      if (err) throw err;
      console.table(res)
    })
  }
}

module.exports = new Run();