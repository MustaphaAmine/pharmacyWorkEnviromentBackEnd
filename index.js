const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cryptage = require('./cryptage/cryptage');
const user = require('./models/user');
const commune = require('./models/commune');
const pharmacy = require('./models/pharmacy');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
port = process.env.PORT || 3000
//connect to mongodb
mongoose.connect('mongodb+srv://mustapha:mustaphadebbih@easypharma-uv4ka.mongodb.net/test?retryWrites=true',{useNewUrlParser:true});


//routes
app.post('/users',(req,res,next)=>{
    var plaint_password = req.body.password;
    var hash_data = cryptage.saltHashPassword(plaint_password);
    var password = hash_data.passwordHash;
    var salt = hash_data.salt;

   const User = new user({
       _id:new mongoose.Types.ObjectId(),
       lastname:req.body.lastname,
       firstname: req.body.firstname,
       email:req.body.email,
       phone_number:req.body.phone_number,
       NSS:req.body.NSS,
       password:password,
       salt:salt
    });

   User.save().then(result=>{
       console.log(result);
       res.status(200).json(result);
    }).catch(err=>console.log(err));
});


app.post("/communes",function(req,res){
var Commune = new commune({
    _id:new mongoose.Types.ObjectId(),
    nomCommune:req.body.nomCommune,
    codeWilaya:req.body.codeWilaya,
});

Commune.save().then(result=>{
    console.log(result);
    res.status(200).json(result);
}).catch(err=>console.log(err));
});

app.post("/pharmacy",function(req,res){
var Pharmacy = new pharmacy({
    _id:new mongoose.Types.ObjectId(),
    nomCommune:req.body.nomCommune,
    nomPrenomPharmacien:req.body.nomPrenomPharmacien,
    heure:req.body.heure,
    adresse:req.body.adresse,
    numeroTelephone:req.body.numeroTelephone,
    facebookUrl:req.body.facebookUrl,
    lienSurCarte:req.body.lienSurCarte,
    caisseConventionnee:req.body.caisseConventionnee,
    dateGarde:req.body.dateGarde
});
Pharmacy.save().then(result=>{
    console.log(result);
    res.status(200).json(result);
}).catch(err=>console.log(err));
});

app.get("/users/:phone/:pwd",(req,res,next)=>{
    var phone = req.params.phone;
    var pwd = req.params.pwd;
    user.find({phone_number:phone},function(error,user){
        var salt = user.salt;
        var hashed_password = cryptage.checkHashPassword(pwd,salt).passwordHash;
        var encrypted_password = user.password;
        if(hashed_password == encrypted_password){
            res.status(200).json(user);
            console.log("wrong");
        }else{
            res.status(200).json(null);
            console.log("true");
        }
    });
});

app.post('/login',(request,response,next)=>{
    var phone = request.body.phoneNumber;
    var pwd = request.body.password;
     
    user.find({phone_number:phone},function(error,user){
        var salt = user.salt;
        var hashed_password = cryptage.checkHashPassword(pwd,salt).passwordHash;
        var encrypted_password = user.password;
        if(hashed_password == encrypted_password){
            response.json('Login success');
            console.log('Login success');
        }else{
            response.json('password wrong');
            console.log('password wrong');        
        }
    });


});

app.get("/communes",function(req,res){
    commune.find({}).select('-_id').exec(function(err,communes){
        res.status(200).json(communes);
        console.log(err);
    });
});

app.get("/pharmacies/:nomCommune",function(req,res){
    var nomcommune = req.params.nomCommune;

    pharmacy.find({nomCommune:nomcommune},'-_id nomPrenomPharmacien heure adresse numeroTelephone facebookUrl lienSurCarte caisseConventionnee dateGarde',
    function(err,pharmacie){
    res.status(200).json(pharmacie);
    });
});


app.listen(port,function(){
    console.log("your are listening on port 3000");
});
