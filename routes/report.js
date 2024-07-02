const Reports = require("./../models/report");
const verifyToken= require("./verifyToken");
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const ApiError = require("./../utils/apiError");

//create   !!!!!!!!!!
router.post("/",verifyToken.verifyToken,
asyncHandler(async(req,res)=>{
const newReport= new Reports(req.body)

    const savedReport=await newReport.save();
    res.status(200).json({data:savedReport});
}));

//update

router.put("/:id",verifyToken.verifyToken,
asyncHandler(async (req,res,next) => {
    
        const updatedReport=await Reports.findByIdAndUpdate(req.params.id,
            {
            $set:req.body
        },{new:true});
        if (!updatedReport){
            return  next(new ApiError (`no report for this id: ${req.params.id}`));
        }
        res.status(200).json({data:updatedReport});

}));

//delete

router.delete("/:id",verifyToken.verifyToken,
asyncHandler(async (req,res,next) => {
    
       const report= await Reports.findByIdAndDelete(req.params.id);
       if (!report){
       return  next(new ApiError (`no report for this id: ${req.params.id}`));
       }
       res.status(200).json("Report has been deleted");

}));

//get report

router.get("/find/:id",verifyToken.verifyTokenAndManager||verifyToken.verifyTokenAndAuthorization,asyncHandler(async (req,res,next) => {
    
    const report= await Reports.findById(req.params.id);
    if(!report){
        return    next(new ApiError (`no report for this id: ${req.params.id}`));
    }
    res.status(200).json({data:report});
    
}));


//get all reports

router.get("/",verifyToken.verifyTokenAndManager||verifyToken.verifyTokenAndAuthorization,asyncHandler(async (req,res) => {
    const qNew =req.query.new;
    const page=req.query.page * 1 || 1;
    const limit =req.query.limit * 1 || 5 ;
    const skip=(page - 1) * limit;//(2-1)*5 =5
    
    
        let reports;
        if(qNew){
            reports=await Reports.find().sort({createdAt:-1}).skip(skip).limit(limit);

    }else{
        reports=await Reports.find().skip(skip).limit(limit);
        }
        res.status(200).json({results:reports.length,page,data:reports});
    

}));




module.exports= router;