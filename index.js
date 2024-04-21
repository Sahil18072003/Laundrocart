const express = require('express');
const cookiePraser = require("cookie-parser");
const app = express();
const port = 8000;
const db = require('./config/mongoose');   //to connect with database 

app.use('/assests', express.static('assests'))   // For serving static files
app.use(express.urlencoded())                   //form ma data submit thay te samaae use thay (middleware)

app.use(cookiePraser());   //for cookie-parser

//setting view engine as ejs
app.set('view engine','ejs');  
app.set('views','./views');

//for PayTm
const https = require("https");
const qs = require("querystring");

app.use('/',require('./routes/home'));


app.listen(port,(err)=>{
    if(err){
        console.log('Error in running the server');
    }
    console.log(`Yup, The server is running successfully on ${port}`);
})