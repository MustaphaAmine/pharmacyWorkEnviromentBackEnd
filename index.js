const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cryptage = require('./cryptage/cryptage');
const user = require('./models/user');
const commune = require('./models/commune');
const pharmacy = require('./models/pharmacy');

const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));
//add other middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(morgan('dev'));

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

app.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/sendimg/:name', function(req,res){
    
    name = req.params.name
    //if(req.user){
        res.sendFile('/uploads/'+name, { root: __dirname });
    /*} else {
        res.status(401).send('Authorization required!');
    }*/
});

app.listen(port,function(){
    console.log("your are listening on port 3000");
});
