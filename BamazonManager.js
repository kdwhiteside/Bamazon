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
			array = [];
			connection.query('SELECT * FROM Products', function(err, rows, fields) {
				if (err) throw err;
				for (var i = 0; i < rows.length; i++) {
					array.push(rows[i].ProductName)
				}console.log(array)
			})
			inquirer.prompt([
				{
					type: 'list',
					name: 'addToWhat',
					message: 'What would you like to add more of?',
					choices: function(){
						return array},
				},
				{
					type: 'input',
					message: 'How many?',
					name: 'number'
				}
				]).then(function(answer){
						connection.query('UPDATE Products SET StockQuantity = StockQuantity + ? WHERE ProductName = ?',[parseInt(answer.number), answer.addToWhat], function(err, rows, fields) {
							if (err) throw err;
							console.log("OK")
						})
				connection.end();

			})
		}else if (answer.menu == 'Add New Product') {
			inquirer.prompt([
	  			{
	  				type: "input",
	  				name: "name",
	  				message: "What is the name of the new product?"
	  			},{
	  				type: "input",
	  				name: "price",
	  				message: "What is the price of the new product?"
	  			},{
	  				type: "input",
	  				name: "department",
	  				message: "What is the department of the new product?"
	  			},{
	  				type: "input",
	  				name: "stock",
	  				message: "How many of the new product do we have?"
	  			}]).then(function(answer){
					connection.query("INSERT INTO products SET ?", {
					    ProductName: answer.name,
					    departmentName: answer.department,
					    Price: answer.price,
					    StockQuantity: answer.stock
					}, function(err, res) {
						if(err) throw err;
						console.log(res);
					});
					console.log("OK!")
					connection.end();

				})
					}
	})
