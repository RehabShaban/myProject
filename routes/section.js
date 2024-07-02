const Sections = require("./../models/sections");
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

const fileName =`section-${uuidv4()}-${Date.now()}.jpeg`;
await sharp(req.file.buffer)
.resize(400, 400)
.toFormat("jpeg")
.jpeg({quality:90})
.toFile(`uploads/sections/${fileName}`);

req.body.sectionImage=req.hostname+fileName;
next();
});


//create  
router.post("/",upload.single('sectionImage'),resizeImage
,verifyToken.verifyTokenAndManager,
asyncHandler(async(req,res)=>{
    
    const newSection= new Sections(req.body)
    const savedSection =await newSection.save();
    res.status(200).json({data:savedSection});
}));

// //update

router.put("/:id",upload.single('sectionImage'),resizeImage
,verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res,next) => {

            const updatedSections=await Sections.findByIdAndUpdate(req.params.id,
            {
            $set:req.body
        },{new:true});
        if (!updatedSections){
        return  next(new ApiError (`no section for this id: ${req.params.id}`));
        }
        res.status(200).json({data:updatedSections});

}));

// //delete

router.delete("/:id",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res,next) => {
    
    const section= await Sections.findByIdAndDelete(req.params.id);

    if(!section){
    return  next(new ApiError (`no section for this id: ${req.params.id}`));
    }
    res.status(200).json("Product has been deleted");

}));

// //get section

router.get("/find/:id",asyncHandler(async (req,res,next) => {
    
    const section= await Sections.findById(req.params.id);
    if (!section){
    return next(new ApiError (`no section for this id: ${req.params.id}`));
    }
    res.status(200).json({data:section});

}));


// //get all sections

router.get("/",asyncHandler(async (req,res) => {
    
        const page=req.query.page * 1 || 1;
        const limit =req.query.limit * 1 || 5 ;
        const skip=(page - 1) * limit;//(2-1)*5 =5
        
    const sections = await Sections.find().skip(skip).limit(limit);
    res.status(200).json({results:sections.length,page,data:sections});


}));




module.exports= router;