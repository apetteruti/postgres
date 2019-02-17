const { Client } = require('pg')
var inquirer = require("inquirer");
var Table = require('easy-table')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432,
  })


client.connect()

client.query('SELECT $1::text as message', ['-----WELCOME TO The National Parks Tracker-----'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  optionsMenu();
  // client.end()
})

function readParks(){

  // console.log("-----WELCOME TO The National Parks Tracker-----")

  client.query("SELECT parks_name as parks_name, location as location, visited as visited FROM public.parks", 
  function (err, results) {
    if (err) throw err;
    console.log(Table.print(results.rows));
    optionsMenu();
  });
}





var optionsMenu = function () {
  inquirer.prompt([{

    name: "options",
    type: "list",
    choices: ["See park list", "Create a new park", "Update a park", "Delete a park"],
    message: "What would you like to do?"

  }]).then(function (answer) {
    switch (answer.options) {
      case "See park list":
        readParks();
        break;
      case "Create a new park":
        createPark();
        break;
      case "Delete a park":
        deletePark();
        break;
      case "Update a park":
        updatePark();
        break;
    }
  })
}