const design = require("./../models/design");
const Designer= require("./../models/designer");
const verifyToken= require("./verifyToken");
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const ApiError = require("./../utils/apiError");


const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');



const multerStorage = multer.memoryStorage()


const multerFilter =function (req, file, cb) {
    if (file.mimetype.split('/')[0]=="image") {
        cb(null, true);
    } else {
        cb(new ApiError('Only images are allowed',400),false);
}
};


const upload = multer({ storage: multerStorage , fileFilter :multerFilter});


const resizeImage= asyncHandler(async (req,res,next) => {

const fileName =`design-${uuidv4()}-${Date.now()}.jpeg`;
await sharp(req.file.buffer)
.resize(400, 400)
.toFormat("jpeg")
.jpeg({quality:90})
.toFile(`uploads/designs/${fileName}`);

req.body.designImage=req.hostname+fileName;
next();
});

//create   !!!!!!!!!!
router.post("/",upload.single('designImage'),resizeImage
,verifyToken.verifyTokenAndDesigner,asyncHandler(async(req,res)=>{
const newdesign= new design(req.body)
const designerid= Designer.findById(req.body.designer);
if (!designerid){
    return  next(new ApiError (`no section for this id: ${req.body.designer}`));
};
    const saveddesign =await newdesign.save();
    res.status(200).json({data:saveddesign});
}));

//update

router.put("/:id",upload.single('designImage'),resizeImage
,verifyToken.verifyTokenAndManager||verifyToken.verifyTokenAndDesigner,
asyncHandler(async (req,res,next) => {
    
        const updateddesign=await design.findByIdAndUpdate(req.params.id,
            {
            $set:req.body
        },{new:true});
        if (!updateddesign){
            return  next(new ApiError (`no design for this id: ${req.params.id}`));
        }
        res.status(200).json({data:updateddesign});

}));

//delete

router.delete("/:id",verifyToken.verifyTokenAndManager||verifyToken.verifyTokenAndDesigner,
asyncHandler(async (req,res,next) => {
    
       const design= await design.findByIdAndDelete(req.params.id);
       if (!design){
       return  next(new ApiError (`no design for this id: ${req.params.id}`));
       }
       res.status(200).json("design has been deleted");

}));

//get design

router.get("/find/:id",verifyToken.verifyTokenAndManager||verifyToken.verifyTokenAndDesigner,asyncHandler(async (req,res,next) => {
    
    const design= await design.findById(req.params.id);
    if(!design){
        return    next(new ApiError (`no design for this id: ${req.params.id}`));
    }
    res.status(200).json({data:design});
    
}));


//get all design

router.get("/",verifyToken.verifyTokenAndManager||verifyToken.verifyTokenAndDesigner,asyncHandler(async (req,res) => {
    const qNew =req.query.new;
    const qSection =req.query.sections;
    const page=req.query.page * 1 || 1;
    const limit =req.query.limit * 1 || 5 ;
    const skip=(page - 1) * limit;//(2-1)*5 =5
    
    
        let design;
        if(qNew){
            design=await design.find().sort({createdAt:-1}).skip(skip).limit(limit);

        }else if(qSection){
            design=await design.find({sections:{$in:[qSection],}}).skip(skip).limit(limit)
        }else{
            design=await design.find().skip(skip).limit(limit);
        }
        res.status(200).json({results:design.length,page,data:design});
    

}));


module.exports= router;