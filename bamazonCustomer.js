//dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon_db'
});

//connects to database
connection.connect(function(err) {
  if (err) throw err;
});

function queryProducts() {
  connection.query(
    'SELECT id, product_name, price, stock_quantity FROM products',
    function(error, results, fields) {
      if (error) throw error;

      console.log('PRODUCTS FOR SALE');

      console.table(results);

      makePurchase();
    }
  );
}

queryProducts();

function makePurchase() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'What is the ID of the product you would like to purchase?',
        validate: function(value) {
          var regexp = /^\d+$/;
          return regexp.test(value)
            ? true
            : 'Please enter a number, no letters.';
        }
      },
      {
        type: 'input',
        name: 'quantity',
        message: 'How much of this product do you want?',
        validate: function(value) {
          var regexp = /^\d+$/;
          return regexp.test(value)
            ? true
            : 'Please enter a number, no letters.';
        }
      }
    ])
    .then(function(data) {
      var id = parseInt(data.id);
      connection.query('SELECT * FROM products WHERE id = ' + id, function(
        error,
        results,
        fields
      ) {
        if (error) {
          console.log('Sorry, none of our records match this product ID.');
          newPurchase();
        } else {
          var selectedProduct = results[0];

          if (data.quantity <= selectedProduct.stock_quantity) {
            var newStock = selectedProduct.stock_quantity - data.stock_quantity;
            connection.query(
              'UPDATE products SET ? WHERE ?',
              [
                {
                  stock_quantity: selectedProduct.stock_quantity
                },
                { id: id }
              ],
              function(error, results, fields) {
                var totalCost =
                  parseFloat(selectedProduct.price) * parseFloat(data.quantity);
                console.log(
                  'Congrats on your order! Your total is: $' + totalCost
                );

                newPurchase();
              }
            );
          } else {
            console.log(
              "There's not enough in stock to fulfill your order, please try again with a lesser amount or order a different product."
            );

            newPurchase();
          }
        }
      });
    });
}

function newPurchase() {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'purchase',
        message: 'Do you want to make another purchase?'
      }
    ])
    .then(function(data) {
      if (data.purchase) {
        makePurchase();
      } else {
        console.log('Thank you for shopping!');
        connection.end();
      }
    });
}
