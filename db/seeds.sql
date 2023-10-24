INSERT INTO department (name)
VALUES ("Development"),
        ("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Developer", 120000, 1),
        ("Developer", 80000, 1),
        ("Junior Developer", 50000, 1),
        ("Lead IT", 110000, 2),
        ("IT", 70000, 2),
        ("Junior IT", 40000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, NULL),
        ("Susan", "Jane", 2, 1),
        ("Bayaz", "James", 4, NULL),
        ("Malacus", "Quai", 5, 3),
        ("Logan", "South", 3, 1),
        ("Ferro", "Maljinn", 6, 3);