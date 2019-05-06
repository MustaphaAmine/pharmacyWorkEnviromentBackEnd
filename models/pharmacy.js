const mongoose = require('mongoose');
const pharmacySchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    nomCommune:String,
    nomPrenomPharmacien:String,
    heure:String,
    adresse:String,
    numeroTelephone:String,
    facebookUrl:String,
    lienSurCarte:String,
    caisseConventionnee:String,
    dateGarde:{String,trim:true},
    versionKey: false
});

module.exports = mongoose.model('pharmacy',pharmacySchema);