var inquirer = require('inquirer');
var mysql = require('mysql');
var mysql      = require('mysql');
var cost = 0;
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'Bamazon'
});
connection.connect();

 
function pickItem () {

	connection.query('SELECT * FROM Products', function(err, rows, fields) {
	if (err) throw err;
	console.log("HERE ARE OUR ITEMS BY ID")
	for (var i = 0; i < rows.length; i++) {
	console.log(rows[i].ItemID + ": " + rows[i].ProductName + " from the " + rows[i].DepartmentName + " department")
	}
	inquirer.prompt([
		{
		  	type: 'input',
		  	name: 'choice',
		  	message: "what is the ID of the item you'd like?"
		}
	]).then(function(answer){
  		id = parseInt(answer.choice);
  		console.log(id);
	  	for (var i = 0; i < rows.length; i++) {
	  		if(rows[i].ItemID == answer.choice){
	  			theRow = rows[i];
	  			console.log("we have " + theRow.StockQuantity + " of those!")
	  			inquirer.prompt([
	  			{
	  				type: "input",
	  				name: "numberDesired",
	  				message: "how many would you like?"
	  			}]).then(function(answer){
		  				var number = parseInt(answer.numberDesired)
		  				console.log(number)
		  				if(number > theRow.StockQuantity){
		  					console.log("Sorry, we don't have enough!")
		  					connection.end();
		  				}
		  				else{
		  					console.log("ayyyee")
		  					connection.query('UPDATE Products SET StockQuantity = StockQuantity - ? WHERE ItemID = ?', [number, id], function(err, results) {
								   if (err) throw err;
								   console.log("yoooo")
							});
		  					
		  					cost += parseInt(theRow.Price);
		  					console.log("Your total is $" + cost)
		  					inquirer.prompt([
					  			{
					  				type: "confirm",
					  				name: "keepShopping",
					  				message: "Would you like to keep shopping?"
					  			}]).then(function(answer){
					  				
		  							if (answer.keepShopping) {
		  								pickItem();
		  							}else{
		  								console.log("THANK YOU FOR SHOPPING!");
		  								connection.end();
		  							}
		  						})
					  	}

	  				})
	  		}
  		}
	  })
	});
}
pickItem();