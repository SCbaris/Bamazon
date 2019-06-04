const mysql = require ("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Candac123!.",
    database: "Bamazon"
});

var value=[];
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    starter();
});

function starter(){
    inquirer.prompt(
    {
        type : "list",
        name : "choose",
        message : "Menu Options : \n",
        choices : ["View Products for Sale" ,
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product", "Exit Application"]
    }
    ).then(function(answer){
        
        switch(answer.choose){
            case "View Products for Sale":
                //console.log("showinv sc")
                showInv();
            break;

            case "View Low Inventory":
                lowInv();
            break;

            case "Add to Inventory":
                showInv("addInv");
                
            break;

            case "Add New Product":
                addProduct();
            break;

            case "Exit Application":
                console.log("\n Good Bye! \n");
                connection.end();
        }
    })
}

function showInv(c){
    //console.log("showinv fun")
    let query="SELECT * FROM products";
    connection.query(query , function (err , res){
        if(err) throw err;
        value=res;
        console.log("-------------");
        console.log(res);
        console.log("-------------");
        if(c==null) starter();
        if(c=="addInv") addInv();
    });
}

function lowInv(){
    let query="SELECT * FROM products";
    connection.query(query , function (err , res){
        if(err) throw err;
        var boo=true;
        for(let i = 0 ; i<res.length ; i++){
            if(parseInt(res[i].stock_quantity) <= 4){
                boo=false;
                console.log("-------------");
                console.log(res[i]);
                console.log("-------------");
            }
        }
        if(boo) console.log("All inventory stock is good.");
        starter();
    });
}

function addInv(){
    inquirer.prompt([
        {
            type : "input",
            name : "id",
            message : "Which item's quantity will increase (Enter ID)",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value)>=0) {
                    return true;
                }
                    return false;
            }
        },

        {
            type : "input",
            name : "addedQuantity",
            message : "How many unit will be adding to inventory?",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value)>=0) {
                    return true;
                }
                    return false;
            }
        }
    ]).then(function(answer){
        //console.log(answer.id)
        //console.log(answer.addedQuantity)
        var stock_quantity=0;
        for(let i =0 ; i<value.length ; i++){
            if(value[i].item_id==answer.id) stock_quantity=value[i].stock_quantity
        }
        //console.log(stock_quantity);
        let lastQuantity = parseInt(stock_quantity)+parseInt(answer.addedQuantity) 
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: lastQuantity
              },
              {
                item_id: answer.id
              }
            ],
            function(err, res) {
              console.log(" Products added\n");
              starter();
            }
        );
    })
}

function addProduct(){
    inquirer.prompt([
        {
            type : "input",
            name : "productName",
            message : "What is New Product?"
        },
        {
            type : "input",
            name : "departmentName",
            message : "Which department would you like to desite to put?"
        },
        {
            type : "input",
            name : "price",
            message : "Price of this product? (Enter Number)",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value)>=0) {
                    return true;
                }
                    return false;
              }
        },
        {
            type : "input",
            name : "stockQuantity",
            message : "How much is this product last shipment quantity? (Enter Number)",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value)>=0) {
                    return true;
                }
                    return false;
              }
        },
    ]).then(function(answer){
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.productName,
                    department_name: answer.departmentName,
                    price: answer.price,
                    stock_quantity: answer.stockQuantity
                },
                function(err, res) {
                    console.log(" Product added\n");
                    starter();
                }
          );
        //console.log(answer.productName)
        //console.log(answer.departmentName)
        //console.log(answer.price)
        //console.log(answer.stockQuantity)
    })
}