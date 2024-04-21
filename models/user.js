const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String ,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        require : true,
    },
    phone : {
        type : Number,
        required : true,
    }
});
// },{
//     timestamps : true        //this options add createdAt and uodatedAt properties that are timestamped with a date
// });

const User = mongoose.model('User',userSchema);

module.exports = User;