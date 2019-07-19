const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    lastname: String,
    firstname: String,
    email: String,
    phone_number:String,
    NSS: Number,
    password:String,
    //salt:String,
    versionKey: false
});

module.exports = mongoose.model('Users',userSchema);
 