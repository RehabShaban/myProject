const Client = require("./../models/client");
const verifyToken= require("./verifyToken");
const CryptoJS = require("crypto-js");
const asyncHandler = require('express-async-handler');
const ApiError = require("./../utils/apiError");
const router = require('express').Router();

//update

router.put("/:id",verifyToken.verifyTokenAndAuthorization,
asyncHandler(async (req,res,next) => {
    if(req.body.clientPassword){
        req.body.clientPassword=CryptoJS.AES.encrypt(
            req.body.clientPassword,
            process.env.PASS_SEC 
            ).toString();
    }
    
        const updatedClient=await Client.findByIdAndUpdate(req.params.id,
            {
            $set:req.body
        },{new:true});

        if (!updatedClient){
            return  next(new ApiError (`no client for this id: ${req.params.id}`));
            }
        res.status(200).json({data:updatedClient});
    

}));

//delete

router.delete("/:id",verifyToken.verifyTokenAndAuthorization,
asyncHandler(async (req,res,next) => {

    const client= await Client.findByIdAndDelete(req.params.id);
    if(!client){
        return  next(new ApiError (`no client for this id: ${req.params.id}`));
        }
    res.status(200).json("client has been deleted");
    

}));

//get user

router.get("/find/:id",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res,next) => {

    const client= await Client.findById(req.params.id);
        //////////////?????//
    const {clientPassword, ...others}=client._doc;
    
    if (!client){
        return next(new ApiError (`no client for this id: ${req.params.id}`));
    }
    res.status(200).json({others});
    

}));


//get all user

router.get("/",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res) => {
    const query =req.query.new;
   
//////////////////???//
    const clients= query
    ? await Client.find().sort({_id:-1}).limit(5)
    : await Client.find();
        res.status(200).json({results:clients.length,data:clients});    

}));

//get user stats

router.get ("/stats",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res) =>{
    //get all users in same day in last yaer
    const date = new Date();
    const lastYear = new Date(date.setUTCFullYear(date.getFullYear()-1));

    
        // collection data in month (aggregate)
        const data = await Client.aggregate([
        //comparison my data in createat in database graetthan last year
        {$match:{createdAt:{$gte:lastYear}}},
        //take month number  variable = set month number inside my created
        {$project:{month:{$month:"$createdAt"},},},
        //can group my items , my clients 
        {$group:{_id:"$month", total:{$sum:1}}}
        ])
        res.status(200).json({data:data});

}));


module.exports= router;