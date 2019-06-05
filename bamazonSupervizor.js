const mysql = require ("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Candac123!.",
    database: "Bamazon"
});

function difference (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}


var departments=[];
var superDepartments=[];
var dataArr=[];
var superDataArr=[];
var sales=[0,0,0,0,0,0,0,0,0,0];
var ind=0;

function updateInv(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        dataArr=res;
        for(let i=0 ; i<dataArr.length ; i++){
            //console.log(departments.includes(dataArr[0].department_name))
            if(departments.includes(dataArr[i].department_name)==false){
                //console.log("departments writing");
                departments.push(dataArr[i].department_name)
            } 
            
        }
        //console.log("dataArr.length " + dataArr.length); // works!!
        //console.log("departments " + departments); // works!!
    });
    updateInv1();
}

function updateInv1(){
    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err;
        superDataArr=res;
        for(let i=0 ; i<superDataArr.length ; i++){
            //console.log(superDepartments.includes(dataArr[0].department_name))
            if(superDepartments.includes(superDataArr[i].department_name)==false){
                //console.log("superDepartments writing");
                superDepartments.push(superDataArr[i].department_name)
            } 
            
        }
        //console.log("superDataArr.length " + superDataArr.length) // works!!
        //console.log("superDepartments " + superDepartments); // works!!  
    });   
}

function departmentInit(){
       var arr=[];
       //console.log("superDataArr " + superDataArr);// Works!!
       //console.log("dataArr " + dataArr);// Works!!
       //console.log("superDepartments " + superDepartments);// Works!!
       //console.log("departments " + departments); // Works!!
       //console.log(difference(departments,superDepartments));// Works!!
       //console.log(arr.length==0);// Works!!
       arr=difference(departments,superDepartments);
       console.log(arr); // Works!!

       if(arr.length>0 && ind!=arr.length){
            console.log("There is another department added!")
            inquirer.prompt({
                name: "overhead_cost",
                type: "input",
                message:"What is " + arr[ind] + " department over head cost?",
                validate: function(value) {
                    if (isNaN(value) === false && parseInt(value)>=0) {
                        return true;
                    }
                        return false;
                }
            }).then(function(answer){
                connection.query(
                    "INSERT INTO departments SET ?",
                    {
                        department_name: arr[ind],
                        over_hear_costs: answer.overhead_cost,     
                    },
                    function(err, res) {
                        if (err) throw err;
                        console.log("Over Head Cost Added on New department\n");
                        arr=difference(departments,superDepartments)
                        console.log("ind " + ind + "\n arr.length " + arr.length)
                        if(ind==(arr.length-1)){
            
                            superVizorView();
                        }else if(arr.length>0) {
                            ind++;
                            departmentInit();
                        }
                    }
                );
            });
       };   
}

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    starter();
});

function starter(){
    updateInv();
    inquirer.prompt(
    {
        type : "list",
        name : "choose",
        message : "Welcome SuperVizor \n Menu Options : \n",
        choices : ["View Products for Sale" ,
                    "Add new product",
                    "Remove a product",
                    "Add quantity to a product",
                    "Substract quantity to a product",
                    "View department by sales",
                    "Exit Application"]
    }
    ).then(function(answer){
        
        switch(answer.choose){
            case "View Products for Sale":
                showInv();
            break;


            case "Add quantity to a product":
                showInv("addInv");
            break;


            case "Substract quantity to a product":
                showInv("subInv");
            break;


            case "Add new product":      
                addProduct();
            break;


            case "Remove a product":
                removeProduct();
            break;


            case "View department by sales":
               superVizorView();
            break;


            case "Exit Application":
                console.log("\n Good Bye! \n");
                connection.end();
        }
    })
}

function showInv(c){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for(let i = 0 ; i < res.length ; i++){
            console.log("ID: " + res[i].item_id);
            console.log("Name: " + res[i].product_name);
            console.log("Unit Price (USA Dolar): " + res[i].price + "$");
            console.log("Avaible Stock: " + res[i].stock_quantity);
            console.log("Product Sales: "+ res[i].product_sales);
            console.log("---------------------");
        }
        if(c==null) starter();
        if(c=="addInv") addInv();
        if(c=="subInv") subInv();
    });
}

function addInv(){
    inquirer.prompt([
        {
            type : "input",
            name : "id",
            message : "Which item's quantity will increase (Enter ID)",
            validate: function(value) {
                if (isNaN(value) === false) {
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
                if (isNaN(value) === false) {
                    return true;
                }
                    return false;
            }
        }

    ]).then(function(answer){
        var stock_quantity=0;
        for(let i =0 ; i<dataArr.length ; i++){
            if(dataArr[i].item_id==answer.id) stock_quantity=dataArr[i].stock_quantity
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
    });
};

function subInv(){
    inquirer.prompt([
        {
            type : "input",
            name : "id",
            message : "Which item's quantity will decrease (Enter ID)",
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
            message : "How many unit will be substract to inventory?",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value)>=0) {
                    return true;
                }
                    return false;
            }
        }

    ]).then(function(answer){
        var stock_quantity=0;
        for(let i =0 ; i<dataArr.length ; i++){
            if(dataArr[i].item_id==answer.id) stock_quantity=dataArr[i].stock_quantity
        }
        //console.log(stock_quantity);
        let lastQuantity = parseInt(stock_quantity)-parseInt(answer.addedQuantity) 
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
    });
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
    })
}

function removeProduct(){
    inquirer.prompt([
        {
            type : "input",
            name : "productName",
            message : "What is New Product?"
        },
        {
            type : "input",
            name : "ID",
            message : "What is product ID"
        }
    ]).then(function(answer){
        inquirer.prompt({
            type : "confirm",
            name : "vali",
            message : answer.ID + " " + answer.productName + "\n Are you sure to remove this product?",
            default: false
        }).then(function(confirm){
            //console.log(confirm.vali); //Work!

            //console.log(answer.ID); //Work!
            //console.log(answer.productName); //Work !
            //console.log(checkProductByID(answer.ID));  // Work!
            //console.log(checkProductByProductName(answer.productName)); // Work!
            if(confirm.vali==true && (checkProductByID(answer.ID) && checkProductByProductName(answer.productName))){
                console.log(parseInt(answer.ID));
                console.log(answer.productName);
                connection.query(
                    "DELETE FROM products WHERE item_id = ? AND product_name = ?",
                    [answer.ID, answer.productName],
                    function(err, res) {
                        if (err) throw err;
                        console.log(res);
                        console.log(" Product removed\n");
                        starter();
                    }
                );
            }else {
                console.log("ID or Product name is not valid. Try again.");
                starter();
            }
        });
    })
}

function checkProductByID(ID){
    for(let i = 0 ; i < dataArr.length ; i ++ ){
        if(dataArr[i].item_id==parseInt(ID)) return true;
    }return false; 
}

function checkProductByProductName(productName){
    for(let i = 0 ; i < dataArr.length ; i ++ ){
        if(dataArr[i].product_name===productName) return true; 
    }return false; 
}

function superVizorView(){
    departmentInit();
    console.log(superDataArr)



    for(let i=0; i<superDataArr.length ; i++){
        //console.log("i " + i)
        for(let x=0 ; x<dataArr.length ; x++){
            if(superDataArr[i].department_name===dataArr[x].department_name){
                //console.log(" i x " + i +" " + x);
                sales[i]=sales[i] + dataArr[x].product_sales;
            }
        }
    }sales=sales.slice(0,superDataArr.length);
    //console.log(sales);
    //console.log(superDataArr);
}