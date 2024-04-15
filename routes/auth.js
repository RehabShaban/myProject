const router = require('express').Router();
const  Client =require("../models/client")
const CryptoJS=require("crypto-js");
const jwt = require("jsonwebtoken");

//register

router.post('/register', async (req, res) => {
    const newClient = new Client({
        clientName:req.body.clientName,
        clientEmail:req.body.clientEmail,
        clientPassword:CryptoJS.AES.encrypt(req.body.clientPassword,process.env.PASS_SEC ).toString(),
    
    });
    try{
        const savedClient=await newClient.save();
        res.status(201).json(savedClient);
    }catch(err){
        res.status(500).json( err);
    };


});

//login

router.post("/login",async (req, res) => {
    
    try{
        const client =await Client.findOne({clientName:req.body.clientName});
        !client && res.status(401).json("wrong credentials!")

        const hashedpassword = CryptoJS.AES.decrypt(client.clientPassword,process.env.PASS_SEC );
        const password = hashedpassword.toString(CryptoJS.enc.Utf8);
        password!==req.body.clientPassword && res.status(401).json("wrong credentials!")

        const accessToken = jwt.sign({
            id : client._id,
            isManager: client.isManager,
            isDesigner: client.isDesign,
        },
        process.env.JWT_SEC,
        //expire jwtSec 
        {expiresIn:"3d"}
        );

        const {clientPassword, ...others}=client._doc;

    
        res.status(200).json({...others,accessToken});
    }catch(err){
        res.status(500).json( err);
    };
    
});



module.exports= router;