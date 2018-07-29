var express = require("express");
var path=require('path');
var multer = require("multer");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/chat", function(err)
  {
    if(err)
    {
      console.log(err);
    }
    else
   {
      console.log("database has been connected!");
         }
  });

app.set('views', path.join(__dirname, 'views'));
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use('', express.static(path.join(__dirname + '')));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//storage setup

var storage = multer.diskStorage({
  destination : "./views/uploads/",
  filename : function(req,file,cb){
    cb(null , file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

//upload

var upload = multer({
  storage : storage,
  limits : {fileSize : 1000000000000000}
}).single("myImage");

app.post("/upload", function(req,res){
 upload(req,res,(err) => {
   if(err)
   {
    res.render("file.ejs" , { msg : err});
   }
   else{
    console.log(req.file);
    if(req.file == "undifined")
    {
      res.render("file.ejs" , {msg : "Error : no file slected"});
    }
    else{
     console.log("send");
     res.render("file.ejs" , {msg : "file uploaded!" , file : `uploads/${req.file.filename}` });
    }
   }
 });
});

app.get("/" , function(req,res){
  res.render("file.ejs");
});

app.listen("5099" , function(req,res){
 console.log("server is started");
});