DROP DATABASE IF EXISTS bamazon;

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
    over_hear_costs INT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)  
VALUES ("Apple", "Grocery", 4 , 200, 40.2);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES ("Banana", "Grocery", 2 , 200, 20.3);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES ("Tomato", "Grocery", 3 , 200, 30.4);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Scientific Calculator", "Office Products", 53.2 , 10);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Bluetooth Speaker", "Electronics", 62.95 , 95); 


 INSERT INTO departments (department_name, over_hear_costs) 
 VALUES ("Grocery", 1000); 

INSERT INTO departments (department_name, over_hear_costs) 
VALUES ("Office Products", 5000);

INSERT INTO departments (department_name, over_hear_costs) 
VALUES ("Electronics", 6000); 

-- DELETE FROM products WHERE id = 1; --
-- DELETE FROM products WHERE id = 2; --
-- DELETE FROM products WHERE id = 3; --


SELECT 
    *
FROM
    bamazon.products;
   
SELECT 
    *
FROM
    bamazon.departments;

    