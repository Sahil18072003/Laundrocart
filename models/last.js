const mongoose = require('mongoose');

const lastorder = new mongoose.Schema({
    name: {
        type : String,
        required : true,
    },
    price: {
        type : Number,
        required : true,
    },
    qty : {
        type : Number,
        required : true,
    }
});
  
//Image is a model which has a schema imageSchema
const history = new mongoose.model('history', lastorder);

module.exports = history;