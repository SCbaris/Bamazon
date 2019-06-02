CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(45) NULL,
    price FLOAT(20,2) NULL,
    stock_quantity INT NULL,
    product_sales FLOAT(20,2) NULL DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NULL,
    over_hear_costs FLOAT(40,5) NULL,
    PRIMARY KEY (department_id)
);

 -- INSERT INTO products (product_name, department_name, price, stock_quantity) --
 -- VALUES ("Apples", "Grocery", 3 , 400); --

-- INSERT INTO products (product_name, department_name, price, stock_quantity)-- 
-- VALUES ("Scientific Calculator", "Office Products", 53.2 , 10);--

-- INSERT INTO products (product_name, department_name, price, stock_quantity) -- 
-- VALUES ("Bluetooth Speaker", "Electronics", 62.95 , 95); --


-- DELETE FROM products WHERE id = 1; --
-- DELETE FROM products WHERE id = 2; --
-- DELETE FROM products WHERE id = 3; --


SELECT 
    *
FROM
    bamazon.products;

    