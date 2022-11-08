-- setting up the and creating the taco_employee_db schema
DROP DATABASE IF EXISTS taco_employee_db;
CREATE DATABASE taco_employee_db;
USE taco_employee_db;
--creating the departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL
);
--creating the roles table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(7,3) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY(department_id) REFERENCES departments(id)
);
--creating the employees table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    taco_role_id INT,
    FOREIGN KEY(taco_role_id) REFERENCES roles(id),
    manager_id INT,
    FOREIGN KEY(manager_id) REFERENCES employees(id)
);