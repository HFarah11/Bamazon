CREATE DATABASE bamazon_db;


USE bamazon_db;





CREATE TABLE products
(
  id INTEGER (10)
  AUTO_INCREMENT NOT NULL,
	product_name VARCHAR
  (250) NOT NULL,
	department_name VARCHAR
  (250),
	price DECIMAL
  (10,2) NOT NULL,
	stock_quantity INTEGER
  (10) NOT NULL,
	product_sales DECIMAL
  (10,2) DEFAULT 0.00,
	PRIMARY KEY
  (id)
);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity, product_sales)
  VALUES
    ("Nike Junior Hypervenom", "Cleats", "88.00 ", "12", "0.00"),
    ("Eden Hazard Jersey", "Jerseys ", "92.00", "100", "0.00"),
    ("Olivier Giroud Jersey", "Jerseys ", "13.00", "2", "0.00"),
    ("Chelsea top", "Womens ", "45.00", "40", "0.00"),
    ("Frank Lampard Billboard", "Retro Gear ", "220.00", "20", "0.00"),
    ("Nike Phantom Elite Dynamic", "Cleats ", "345.00", "10", "0.00"),
    ("Chelsea Ball", "Kids ", "16.00", "30", "0.00"),
    ("Chelsea Sneakers", "Kids ", "35.00", "70", "0.00"),
    ("2012 Champions League Jersey", "Retro Gear ", "75.00", "5", "0.00"),
    ("Chelsea T-shirt", "Womens ", "35.00", "45", "0.00");

  CREATE TABLE departments
  (
    department_id INTEGER (10)
    AUTO_INCREMENT NOT NULL,
	department_name VARCHAR
    (250) NOT NULL,
	over_head_costs DECIMAL
    (10,2) NOT NULL,
	total_sales DECIMAL
    (10,2),
	PRIMARY KEY
    (department_id)
);

    INSERT INTO departments
      (department_name, over_head_costs, total_sales)
    VALUES
      ("Jerseys", "100.50", "0.00"),
      ("Cleats", "60.00", "0.00"),
      ("Retro Gear", "50.00", "0.00"),
      ("Womens", "80.00", "0.00"),
      ("Kids", "66.00", "0.00");