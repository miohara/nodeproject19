var express = require("express"); 

var app = express(); 

app.set('view engine', 'ejs'); 

app.use(express.static("views")); 
app.use(express.static("style")); 
app.use(express.static("images")); 

var mysql = require('mysql');

// body parser to get information

var fs = require('fs')
var bodyParser = require("body-parser") 
app.use(bodyParser.urlencoded({extended:true}));


const fileUpload = require('express-fileupload');
app.use(fileUpload());

const db = mysql.createConnection({
host: 'den1.mysql1.gear.host',
    user: 'mikeohnode',
    password: 'Jk2A~F!0Byqe',
    database: 'mikeohnode'
 });


db.connect((err) =>{
     if(err){
        console.log("go back and check the connection details. Something is wrong.")
        // throw(err)
    } 
     else{
        
        console.log('Looking good the database connected')
    }
    
    
})





// app.get('/createtable', function(req,res){
//     // Create a table that will show product Id, name, price, image and sporting activity
//     let sql = 'CREATE TABLE mikeoh (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image varchar(255), Activity varchar(255))';
    
//     let query = db.query(sql, (err,res) => {
        
//         if(err) throw err;
        
//         console.log(res);
        
//     });
    
//     res.send("You created your first DB Table")
    
// })







// app.get('/insert', function(req,res){
//     // Create a table that will show product Id, name, price, image and sporting activity
//     let sql = 'INSERT INTO mikeoh (Name, Price, Image, Activity) VALUES ("polar M400", 199, "polarm400.png", "Running") ';
    
//     let query = db.query(sql, (err,res) => {
        
//         if(err) throw err;
        
//         console.log(res);
        
//     });
    
//     res.send("You created your first Product")
    
// })



// Url to get the products

app.get('/products', function(req,res){
    
    let sql = 'SELECT * FROM mikeoh';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('products', {result})
        
    });
    
    //res.send("You created your first Product")
    
})


app.get('/addproduct', function(req,res){
    
  
        res.render('addproduct')
        
  
    
})





app.post('/addproduct', function(req,res){
    
 let sampleFile = req.files.sampleFile;
   filename = sampleFile.name;
    
    sampleFile.mv('./images/' + filename, function(err){
        
        if(err)
        
        return res.status(500).send(err);
        console.log("Image you are uploading is " + filename)
       // res.redirect('/');
    })
    
    
    
    
    
    let sql = 'INSERT INTO mikeoh (Name, Price, Image, Activity) VALUES ("   '+req.body.name+'   ", '+req.body.price+', "'+filename+'", "'+req.body.activity+'") ';
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/products')
    //res.send("You created your first Product")
    
})




app.get('/editproduct/:id', function(req,res){
    
        let sql = 'SELECT * FROM mikeoh WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('editproduct', {result})
        
    });
    
    
    
    
})





app.post('/editproduct/:id', function(req,res){
    
    let sql = 'UPDATE mikeoh SET Name = "   '+req.body.name+'   ", Price = '+req.body.price+', Image = "'+req.body.image+'", Activity = "'+req.body.activity+'" WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/products')
    //res.send("You created your first Product")
    
})



app.get('/product/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'SELECT * FROM mikeoh WHERE Id = "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(res);
        res.render('products', {result})
    });
    
   // res.redirect('/products')
    //res.send("You created your first Product")
    
})





app.get('/delete/:id', function(req,res){
    
        let sql = 'DELETE FROM mikeoh WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
  
    });
    
    res.redirect('/products')
    
    
})



app.get('/upload', function(req,res){
    
    res.render('upload');
    
})




app.post('/upload', function(req,res){
    
    let sampleFile = req.files.sampleFile;
   filename = sampleFile.name;
    
    sampleFile.mv('./images/' + filename, function(err){
        
        if(err)
        
        return res.status(500).send(err);
        console.log("Image you are uploading is " + filename)
        res.redirect('/');
    })
    
    
    
    
    
})



app.post('/search', function(req,res){
    
        let sql = 'SELECT * FROM mikeoh WHERE Name LIKE  "%'+req.body.search+'%" ';
            let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        console.log(req.body.search);
        res.render('products', {result})
        
    });
    
    
    
    
})


















var contact = require("./model/contact.json");


app.get('/', function(req, res) {
res.render("index"); 
console.log("Hello World"); 
});


app.get('/contacts', function(req,res){
    res.render("contacts", {contact}); 
    console.log("I found the contacts page");
    
});




app.get('/add', function(req,res){
    res.render("add"); 
    console.log("I found the contact us page");
    
});


// post request to send JSON data to server

app.post("/add", function(req,res){

   
    
            function getMax(contacts, id){ 
            var max 
    
                for(var i=0; i<contacts.length; i++){ 
                    if(!max || parseInt(contact[i][id])> parseInt(max[id]))
                    max = contacts[i];
                        }
    
            return max;
             }

             
          
             
              maxCid = getMax(contact, "id")
             
             var newId = maxCid.id + 1;
             
           
             console.log("new Id is " + newId)
             
             
             
             
             var contactsx = {
                 
                 
                 id: newId,
                 name: req.body.name,
                 Comment: req.body.Comment,
                 email: req.body.email
                 
                 
             }
             
             
    fs.readFile('./model/contact.json', 'utf8',  function readfileCallback(err){
        
        if(err) {
            throw(err)
            
        } else {
            
            contact.push(contactsx); 
            json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
            fs.writeFile('./model/contact.json',json, 'utf8')
            
        }
        
    })         
             
     res.redirect('/contacts') ;
    
});





app.get('/editcontact/:id', function(req,res){
  
   function chooseContact(indOne){
       return indOne.id === parseInt(req.params.id)
       }


  var indOne = contact.filter(chooseContact)
    
   res.render('editcontact', {res:indOne}); 
    
});


app.post('/editcontact/:id', function(req,res){
    
    var json = JSON.stringify(contact)
    
  
    var keyToFind = parseInt(req.params.id)
    
   
    var index = contact.map(function(contact) {return contact.id}).indexOf(keyToFind)
    
   
    
    var z = parseInt(req.params.id);
    var x = req.body.name
    var y = req.body.Comment

   

    contact.splice(index, 1, {name: x, Comment: y, email: req.body.email, id: z })
    
  
    
  
    json = JSON.stringify(contact, null, 4); 
    fs.writeFile('./model/contact.json',json, 'utf8', function(){})
    
    res.redirect("/contacts");
    
    
})

app.get('/deletecontact/:id', function(req,res){
    
    
   
    var json = JSON.stringify(contact)
    
 
    var keyToFind = parseInt(req.params.id)
    
   
    var index = contact.map(function(contact) {return contact.id}).indexOf(keyToFind)
    

    contact.splice(index, 1)
    
  
    

    json = JSON.stringify(contact, null, 4); 
    fs.writeFile('./model/contact.json',json, 'utf8', function(){})
    
    res.redirect("/contacts");
    
    
})





app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
console.log("Yippee its running");
  
});


