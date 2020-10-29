INSERT INTO department(department_name)
VALUES("Engineering"),("Marketing"),("Accounting"),("Sales"),("Legal"),("HR");

INSERT INTO role(title,salary,department_id)
VALUES("Software Engineer", 150000, 1),("Web Developer", 100000, 1),("Entry Level Developer", 70000, 1),("Marketing Specialist", 500000, 2),("Marketing Manager", 75000, 2),("Lead Accountant", 80000, 3),("Accountant", 70000, 3),("Sales Engineer", 150000, 4),("Salesperson", 60000, 4),("Sales Director", 100000, 4),("Lawyer", 120000, 5),("Clerk", 70000, 5),("Recruiter", 60000, 6),("Employee Manager", 60000, 6)


INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Rachel","Green",13,4),("Monica","Geller",10,3),("Chandler","Bing",4,2),("Phoebe","Buffay",8,6),("Joey","Tribbiani",11,5),("Ross","Geller",13,7)