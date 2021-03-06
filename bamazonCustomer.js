const mysql = require ("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Candac123!.",
    database: "Bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showInv();
  });


function showInv(){
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      if (res.stock_quantity!=0){
        for(let i = 0 ; i < res.length ; i++){
            console.log("ID: " + res[i].item_id);
            console.log("Name: " + res[i].product_name);
            console.log("Unit Price (USA Dolar): " + res[i].price + "$");
            console.log("Avaible Stock: " + res[i].stock_quantity);
            console.log("---------------------");
        }
      } 
      initialAsking(res);
    });
}

function returningAsking(){
    inquirer.prompt({
        name : "confirm",
        type: "confirm",
        message : "\nWould you like to continue shoping?",
        default: true
    }).then(function(answer){
        if(answer.confirm==true) showInv();
        else if (answer.confirm==false){ 
            console.log("\n Thanks For Choosing Bamazon! \n")
            connection.end()
        };
    })
}

function initialAsking(res){
    inquirer.prompt({
        name: "ID",
        type: "input",
        message: "ID of the product they would like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
                return false;
          }
    }).then(function(answer){
        var boo=true;
        //console.log(res[0].item_id)
        //console.log(answer.ID);
        //console.log(res.length);
        for(let i = 0 ; i<res.length ; i++){
            //console.log(res[i].id)
            //console.log("answer.id " + answer.ID);
            var aID=answer.ID;
            aID=parseInt(aID);
            //console.log("aid " + aID);
            if ( aID===res[i].item_id){
                if(res[i].stock_quantity!=0){
                    boo=false;
                    buyingAsking(res[i]);
                }else if(res[i].stock_quantity<=0){
                    console.log("Item that you choose out of stock.")
                    returningAsking();
                }
            }
        }
        if(boo) {
        console.log("\n\n\nThere is no product that id number\n\n\n");
            returningAsking();
        }
    })
}

function buyingAsking(res){
    inquirer.prompt({
        name: "quantity",
        type: "input",
        message: "How many units of the product they would like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
                return false;
          }
    }).then(function(answer){
        if(answer.quantity<=res.stock_quantity){
            var quantity=res.stock_quantity-answer.quantity;
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                      stock_quantity : quantity,
                      product_sales : res.product_sales+ (res.price*answer.quantity)
                    },
                    {
                      item_id: res.item_id
                    }
                ],
                function(err) {
                if (err) throw err;
                console.log("\n Your Product is :" + res.product_name);
                console.log("\n Your Purches quantity is :" + answer.quantity);
                console.log("\n Total price is :" + (res.price*answer.quantity));
                console.log("\n Product will send your home. Thanks to Choose Bamazon!");

                returningAsking();
              });
        }else{
            console.log("This amount of product cannot be provided.")
            console.log("There are " + quantity + " product left.")
            returningAsking();
        } 
    });
}