const Designer = require("./../models/designer");
const design= require("./../models/design");
const verifyToken= require("./verifyToken");
const CryptoJS = require("crypto-js");
const asyncHandler = require('express-async-handler');
const ApiError = require("./../utils/apiError");
const router = require('express').Router();

//update

router.put("/:id",verifyToken.verifyTokenAndAuthorization&&verifyToken.verifyTokenAndDesigner,
asyncHandler(async (req,res,next) => {
    if(req.body.designerPassword){
        req.body.designerPassword=CryptoJS.AES.encrypt(
            req.body.designerPassword,
            process.env.PASS_SEC 
            ).toString();
    }
    
        const updatedDesigner=await Designer.findByIdAndUpdate(req.params.id,
            {
            $set:req.body
        },{new:true});

        if (!updatedDesigner){
            return  next(new ApiError (`no client for this id: ${req.params.id}`));
            }
        res.status(200).json({data:updatedClient});
    

}));

//delete

router.delete("/:id",verifyToken.verifyTokenAndAuthorization&&verifyToken.verifyTokenAndDesigner,
asyncHandler(async (req,res,next) => {

    const designer= await Designer.findByIdAndDelete(req.params.id);
    if(!designer){
        return  next(new ApiError (`no Designer for this id: ${req.params.id}`));
        }
    res.status(200).json("Designer has been deleted");
    

}));

//get user

router.get("/find/:id",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res,next) => {

    const designer= await Designer.findById(req.params.id);
        //////////////?????//
    const {designerPassword, ...others}=Designer._doc;
    
    if (!designer){
        return next(new ApiError (`no client for this id: ${req.params.id}`));
    }
    res.status(200).json({others});
    

}));


//get all user

router.get("/",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res) => {
    const query =req.query.new;
   

    const designer= query
    ? await Designer.find().sort({_id:-1}).limit(5)
    : await Designer.find();
        res.status(200).json({results:Designer.length,data:designer});    

}));

//get user stats

router.get ("/stats",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res) =>{
    //get all users in same day in last yaer
    const date = new Date();
    const lastYear = new Date(date.setUTCFullYear(date.getFullYear()-1));

    
        // collection data in month (aggregate)
        const data = await Designer.aggregate([
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