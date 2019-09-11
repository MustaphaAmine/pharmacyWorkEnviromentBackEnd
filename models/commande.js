const mongoose = require('mongoose');


const cmdSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nomCmd: String,
    userEmail: String,
    cmdState: String,
    imgName: String,
    dateLancement:String,
    versionKey: false
});

module.exports = mongoose.model('Commands',cmdSchema);