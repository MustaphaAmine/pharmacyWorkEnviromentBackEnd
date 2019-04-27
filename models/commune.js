const mongoose = require('mongoose');


const communeSchema = new mongoose.Schema({
       _id:mongoose.Schema.Types.ObjectId,
        nomCommune:String,
        codeWilaya:Number,
        versionKey: false
});

module.exports = mongoose.model('commune',communeSchema);
