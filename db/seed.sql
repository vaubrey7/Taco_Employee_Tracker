USE taco_employee_db;
-- adds the values below into deparments via deparment_name
INSERT INTO departments (department_name)
VALUES 
('Taco IT'),
('Taco Counting'),
('Taco Marketing'),
('Taco Supreme Makers');
-- sets the values of roles adding values to title, salary and id  
INSERT INTO roles (title, salary, department_id)
VALUES
('Full Stack Taco', 180000, 1),
('Soft Taco Maker', 100000, 1),
('Taco HR', 100000, 2), 
('Taco Counter', 60000, 2),
('Taco Sales Lead ', 70000, 3), 
('Taco Marketing Manager', 90000, 3),
('Big Taco CFO', 910000, 4),
('Taco Supreme CEO', 990000, 4);

-- sets the values of employees by adding their first_name, Last_name, role_id and manager_id

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
('Vaughn', 'Aubrey', 1, NULL),
('Jason', 'Sin', 1, 1),
('Leo', 'Moreno', 4, NULL),
('Michael', 'Spencer', 3, 3),
('Bat', 'Man', 2, NULL),
('Adam', 'Savage', 2, 2),
('Angela', 'Davis', 3, NULL),
('Alair', 'Kowalis', 4, 4);
-- makes it so any manager_id is set to the correct id 
UPDATE `taco_employee_db`.`employees` SET `manager_id` = '1' WHERE (`id` > '1');