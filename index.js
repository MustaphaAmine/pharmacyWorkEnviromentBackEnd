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
//mongoose.connect('mongodb+srv://mustapha:mustaphadebbih@easypharma-uv4ka.mongodb.net/test?retryWrites=true',{useNewUrlParser:true});

//New Connection
// mongodb+srv://mustapha:<password>@pharmacy-dz3jk.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://mustapha:mustaphadebbih@pharmacy-dz3jk.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true});

//routes


app.post('/users',(req,res,next)=>{
   
    const accountSid = "AC8aef5de6be931e111923732b57831288";
    const authToken = "c0e9cbfc01c2fdfbed17533bf00dd5cc";
    const fromPhoneNumber = "+17729197460";
    const toPhoneNumber = req.body.phone_number;
    const message = "This is your password: " + req.body.password;
    const client = require('twilio')(accountSid, authToken);
    const User = new user({
       _id:new mongoose.Types.ObjectId(),
       lastname:req.body.lastname,
       firstname: req.body.firstname,
       email:req.body.email,
       phone_number:req.body.phone_number,
       NSS:req.body.NSS,
       password:req.body.password,
    });



    user.find({email:req.body.email}, function (err, user) {
        if (user.length){
            res.status(200).json({"result":false,"message":"email existe déjà"})
        }else{
            User.save().then(result=>{
                console.log(result);
                res.status(200).json({"result":true,"message":"Votre compte a été créé avec succé"});
             }).catch(err=>console.log(err));
             
           
             client.messages
               .create({
                  body: message,
                  from: fromPhoneNumber,
                  to: toPhoneNumber
                })
               .then(message => console.log(message.sid));
        }
    });  
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
    caisseConventionnee:req.body.caisseConventionnee,
    dateGarde:req.body.dateGarde
});
Pharmacy.save().then(result=>{
    console.log(result);
    res.status(200).json(result);
}).catch(err=>console.log(err));
});


app.get('/updatePassword/:useremail/:lastpassword/:newpassword',(req,res,next)=>{
    var useremail = req.params.useremail;
    var lastpassword = req.params.lastpassword;
    var newpassword = req.params.newpassword;

    user.updateOne({email:useremail,password:lastpassword},{password:newpassword},function(error,user){
        if(error){
            res.status(500).json({"result":false,"message":error});
        }else{
            if(user.nModified==0) {
            res.status(200).json({"result":false,"message":"your email address or password is wrong"});
               console.log("your email address or password is wrong");
            }else {
                res.status(200).json({"result":true,"message":"Votre mot de passe et modifier avec succés"});
            }
        }
    });
});

app.get("/login/:useremail/:pwd",(req,res,next)=>{
    var useremail = req.params.useremail;
    var pwd = req.params.pwd;
    user.findOne({email:useremail},function(error,user){
        if(error){
            res.status(500).json({"result":false,"message":"something went wrong with the server"})
        }else{
        var userpassword = user.password;
        if(pwd == userpassword){
            res.status(200).json({"result":true,"massage":"password compatible with email"});
            console.log("True");
        }else{
            res.status(200).json({"result":false,"message":"you're password or email address is wrong"});
            console.log("Wrong");
        }
    }
    });
});

/*app.post('/login',(request,response,next)=>{
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
*/

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

app.get("/pharmacies",function(req,res){
    pharmacy.find({},'-_id nomPrenomPharmacien heure adresse numeroTelephone facebookUrl lienSurCarte caisseConventionnee dateGarde',
    function(err,pharmacie){
    res.status(200).json(pharmacie);
    });
})

app.get("/pharmaciegarde/:dategard",function(req,res){
    var dategard = req.params.dategard;;
    pharmacy.find({dateGarde:dategard},function(err,pharmacie){
        res.status(200).json(pharmacie);
    });   
});

app.listen(port,function(){
    console.log("your are listening on port 3000");
});
