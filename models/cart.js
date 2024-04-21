const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
    },
    email : {
        type : String,
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
const Image = new mongoose.model('cart', imageSchema);

module.exports = Image;