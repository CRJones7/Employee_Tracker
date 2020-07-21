-- Create DB
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

-- employee table
CREATE TABLE employee (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR
(30),
    last_name VARCHAR
(30),
    role_id INT,
    manager_id INT,
);

-- Role table
CREATE TABLE role (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR
(30),
    salary DECIMAL,
    department_id INT,
);

-- department table 
CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR
(30),
);

-- Seeds

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES('Courtney', 'Jones'),
    ('Abi', 'Junk'),
    ('Raymond', 'Obena'),
    ('Niels', 'Pateow'),
    ('Stephanie', 'Brown'),
    ('Taylor', 'Hicks')

INSERT INTO role
    (title, salary, department_id)
VALUES('Lead Engineer', 155000, 1),
    ('Front-End Developer', 100000, 1),
    ('Back-End Developer', 120000, 1),
    ('Lead Sales Associate', 85000, 2),
    ('Sales Associate Level 1', 75000, 2),
    ('Accountant', 95000, 3),
    ('Lawyer', 190000, 4),
    ('Director of Human Resources', 85000, 5),
    ('HR Admin', 65000, 5);

INSERT INTO department
    (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Finance'),
    ('Legal'),
    ('Human Resources');



-- Should return a table sorted by department
-- Should return a table sotred by department
SELECT department.name, role.title, employee.first_name, employee.last_name
FROM department, role, employee
WHERE employee.role_id = role.id AND role.department_id = department.id
ORDER BY department.name



-- combining table role and employee
SELECT employee.first_name, employee.last_name , role.title
FROM employee LEFT JOIN role ON employee.role_id = role.id

-- getting employees by first and last name
SELECT first_name, last_name
FROM employee

-- Deleting employee
DELETE FROM employee WHERE ?

-- adding employee

INSERT INTO employee
SET
?

-- combining role table with department table
SELECT role.title, role.salary, role.department_id, department.name
FROM role LEFT JOIN department ON role.department_id = department.id

