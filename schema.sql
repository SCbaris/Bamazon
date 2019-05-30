CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(45) NULL,
    price FLOAT(20,4) NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (item_id)
);


-- INSERT INTO products (product_name, department_name, price, stock_quantity) --
-- VALUES ("Pen", "Office Products", 3 , 100); -- 

-- INSERT INTO products (product_name, department_name, price, stock_quantity) --
-- VALUES ("Scientific Calculator", "Office Products", 53.2 , 10); --

-- INSERT INTO products (product_name, department_name, price, stock_quantity) --
-- VALUES ("Bluetooth Speaker", "Electronics", 62.95 , 95); --


-- DELETE FROM products WHERE id = 1; --
-- DELETE FROM products WHERE id = 2; --
-- DELETE FROM products WHERE id = 3; --

SELECT 
    *
FROM
    bamazon.products;

    