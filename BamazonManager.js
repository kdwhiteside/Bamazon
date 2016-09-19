var inquirer = require('inquirer');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'Bamazon'
});
connection.connect();
inquirer.prompt([
	{
		type: 'list',
		name: 'menu',
		message: 'What would you like to do?',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
	}
	]).then(function(answer){
		if (answer.menu == 'View Products for Sale') {
			connection.query('SELECT * FROM Products', function(err, rows, fields) {
				if (err) throw err;
				console.log("HERE ARE OUR ITEMS BY ID")
				for (var i = 0; i < rows.length; i++) {
					console.log(rows[i].ItemID + ": we have " + rows[i].StockQuantity + " " + rows[i].ProductName + " for $" + rows[i].Price + " each")
				}

			})
			connection.end();
		}else if (answer.menu == 'View Low Inventory') {
			connection.query('SELECT * FROM Products WHERE StockQuantity <= 5', function(err, rows, fields) {
				if (err) throw err;
				console.log("HERE ARE OUR ITEMS BY ID")
				for (var i = 0; i < rows.length; i++) {
					console.log(rows[i].ItemID + ": we only have " + rows[i].StockQuantity + " " + rows[i].ProductName + " left!")
				}

			})
			connection.end();

		}else if (answer.menu == 'Add to Inventory') {

		}else if (answer.menu == 'Add New Product') {

		}
	})
