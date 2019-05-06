const mongoose = require('mongoose');
const pharmacySchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    nomCommune:String,
    nomPrenomPharmacien:String,
    heure:String,
    adresse:String,
    numeroTelephone:String,
    facebookUrl:String,
    caisseConventionnee:String,
    dateGarde:{type:String,trim:true},
    versionKey: false
});

module.exports = mongoose.model('pharmacy',pharmacySchema);