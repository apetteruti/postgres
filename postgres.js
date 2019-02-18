const {
  Client
} = require('pg')
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

function readParks() {

  // console.log("-----WELCOME TO The National Parks Tracker-----")

  client.query("SELECT parks_name as parks_name, location as location, visited as visited FROM public.parks",
    function (err, results) {
      if (err) throw err;
      console.log(Table.print(results.rows));
      optionsMenu();
    });
};

function createPark() {
  inquirer.prompt([{
        name: "parks_name",
        type: "input",
        message: "What is the name of the park you would like to add?"
      },
      {
        name: "location",
        type: "input",
        message: "In which state is the park located?"
      },
      {
        name: "visited",
        type: "confirm",
        message: "Have you visited this park?"
      }
    ])
    .then(function (answer) {
      const text = `INSERT INTO public.parks (parks_name, location, visited) VALUES ($1,$2,$3)`
      const values = [answer.parks_name, answer.location, answer.visited]
      client.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log(res)

          optionsMenu();
        }
      })
    })
};

function updatePark() {
  client.query("SELECT parks_name as parks_name FROM public.parks",
    function (err, results) {
      if (err) throw err;
      // console.log(results);
      inquirer.prompt([{
          name: "choice",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];

            for (var i = 0; i < results.rows.length; i++) {
              choiceArray.push(results.rows[i].parks_name);
            }
            return choiceArray;
          },
          message: "Which park have you visited?"
        }])
        .then(function (answer) {
          const text = `UPDATE public.parks SET visited = true WHERE parks_name = $1`;
          const value = [answer.choice];
          client.query(text, value, (err, res) => {
            if (err) {
              console.log(err.stack)
            } else {
              // console.log(res)
              console.log("----------------------------------");
              console.log(answer.choice + " has been set to Visited!");
              console.log("----------------------------------")
              optionsMenu();
            }

          })
        })
    }
  )
}


function deletePark() {
  client.query("SELECT parks_name as parks_name FROM public.parks",
    function (err, results) {
      if (err) throw err;
      // console.log(results);
      inquirer.prompt([{
          name: "choice",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];

            for (var i = 0; i < results.rows.length; i++) {
              choiceArray.push(results.rows[i].parks_name);
            }
            return choiceArray;
          },
          message: "Which park would you like to remove from the list?"
        }])
        .then(function (answer) {
          // console.log(answer.choice);
          const text = 'DELETE FROM public.parks WHERE parks_name = $1';
          const value = [answer.choice];
          client.query(text, value, (err, res) => {
            if (err) {
              console.log(err.stack)
            } else {
              console.log(res)
              optionsMenu();
            }
          })
        })
    })
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