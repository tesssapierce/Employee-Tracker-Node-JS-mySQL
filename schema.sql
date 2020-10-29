DROP DATABASE IF EXISTS employeedb;
CREATE DATABASE employeedb;

USE employeedb;

CREATE TABLE department(
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(30)
);
CREATE TABLE role(
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary INT,
department_id INT UNSIGNED NOT NULL
);
CREATE TABLE employee(
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT UNSIGNED NOT NULL,
manager_id INT UNSIGNED
);