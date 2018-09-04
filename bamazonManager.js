var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');
var productList = [];
var deptList = [];

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon_db'
});

connection.connect();

initialize();

// ========== FUNCTIONS =========== //

function initialize() {
  inquirer
    .prompt([
      {
        name: 'action',
        message: 'What would you like to do?',
        type: 'list',
        choices: [
          'View Products for Sale',
          'View Low Inventory',
          'Add to Inventory',
          'Add New Product',
          'Exit'
        ]
      }
    ])
    .then(function(answers) {
      // run appropriate function per answer above
      if (answers.action === 'View Products for Sale') {
        viewProd();
      } else if (answers.action === 'View Low Inventory') {
        viewLow();
      } else if (answers.action === 'Exit') {
        exitApp();
      } else if (answers.action === 'Add to Inventory') {
        // create an array of current products
        var products = [];
        connection.query('SELECT product_name FROM products', function(
          err,
          res
        ) {
          for (h = 0; h < res.length; h++) {
            products.push(res[h].product_name);
          }
          // run add inventory function, pass in products array
          addInv(products);
        });
      } else if (answers.action === 'Add New Product') {
        addProd();
      }
    });
}

function viewProd() {
  connection.query(
    'SELECT id, product_name, price, stock_quantity FROM products',
    function(error, results, fields) {
      if (error) throw error;

      console.log('PRODUCTS FOR SALE');

      console.table(results);
      initialize();
    }
  );
}

function viewLow() {
  connection.query(
    'SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5',
    function(error, results, fields) {
      if (error) throw error;

      console.log('PRODUCTS WITH LOW STOCK');

      console.table(results);
      initialize();
    }
  );
}

function addInv(array) {
  // ask user info to add inventory
  inquirer
    .prompt([
      {
        name: 'item',
        message: 'Which item would you like to add inventory to?',
        type: 'list',
        choices: array
      },
      {
        name: 'amount',
        message: 'How many more units would you like to add?'
      }
    ])
    .then(function(answers) {
      // select the stock qty from products for product user specified above
      connection.query(
        'SELECT stock_quantity FROM products WHERE product_name = ?',
        [answers.item],
        function(err, res) {
          // add previous amount and amount being added
          var stockQty =
            parseInt(answers.amount) + parseInt(res[0].stock_quantity);
          // update table with new stock quantity
          connection.query(
            'UPDATE products SET ? WHERE ?',
            [
              {
                stock_quantity: stockQty
              },
              {
                product_name: answers.item
              }
            ],
            function(err, res) {
              if (err) {
                throw err;
              } else {
                // let user know the stock quantity has been updated
                console.log(
                  'The inventory for ' +
                    answers.item +
                    ' is now ' +
                    stockQty +
                    ' units.\n'
                );
              }
              //re-initialize app
              initialize();
            }
          );
        }
      );
    });
}

function exitApp() {
  console.log('Enjoy your day!');
  connection.end();
}

function addProd() {
  connection.query('SELECT department_name FROM departments', function(
    err,
    res
  ) {
    var departments = [];
    for (var k = 0; k < res.length; k++) {
      departments.push(res[k].department_name);
    }
    // ask user info about new product
    inquirer
      .prompt([
        {
          name: 'product',
          message: 'Enter name of product you would like to add.'
        },
        {
          name: 'price',
          message: 'Enter price of product to be added.'
        },
        {
          name: 'quantity',
          message: 'Enter quantity of product to be added.'
        },
        {
          name: 'department',
          message: 'Select the department of product to be added.',
          type: 'list',
          choices: departments
        }
      ])
      .then(function(answers) {
        // product info variables
        var product = answers.product;
        var price = answers.price;
        var quantity = answers.quantity;
        var department = answers.department;
        // make sure user wants to add their product
        inquirer
          .prompt([
            {
              name: 'validation',
              message:
                'Are you sure you want to add ' +
                answers.product +
                ' to the store?',
              type: 'list',
              choices: ['Yes', 'No']
            }
          ])
          .then(function(answers) {
            // if yes, insert product and info into products table
            if (answers.validation === 'Yes') {
              connection.query(
                'INSERT INTO products SET ?',
                {
                  product_name: product,
                  price: price,
                  department_name: department,
                  stock_quantity: quantity,
                  product_sales: 0.0
                },
                function(err, res) {
                  if (err) {
                    throw err;
                  } else {
                    console.log('\nYour item has been added.\n');
                    //re-initialize app
                    initialize();
                  }
                }
              );
              // if no, let user know product has not been added
            } else {
              console.log('\nYour item has not been added.\n');
              //re-initialize app
              initialize();
            }
          });
      });
  });
}
