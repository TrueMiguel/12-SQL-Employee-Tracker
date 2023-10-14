INSERT INTO department (name)
VALUES ("Legal"),
    ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", "60000", 1),
    ("Lawer", "50000", 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Smith", "Department Manager")