//require the library
const mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb://localhost/laundrokart');

//acquire the connection(to check if it's successful)
const db = mongoose.connection;

//error
db.on('error',console.error.bind(console, "Error connecting to MongoDB"));

//up and running then print the message
db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;