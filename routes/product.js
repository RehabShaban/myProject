const Products = require("./../models/products");
const Section=require("./../models/sections");
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

const fileName =`Product-${uuidv4()}-${Date.now()}.jpeg`;
await sharp(req.file.buffer)
.resize(400, 400)
.toFormat("jpeg")
.jpeg({quality:90})
.toFile(`uploads/products/${fileName}`);

req.body.productImage=req.hostname+fileName;
next();
});

//create   !!!!!!!!!!
router.post("/",upload.single('productImage'),resizeImage
,verifyToken.verifyTokenAndManager,asyncHandler(async(req,res)=>{
const newProduct= new Products(req.body)
    const section= Section.findById(req.body.sections);
    if (!section){
        return  next(new ApiError (`no section for this id: ${req.body.sections}`));
    };
    const savedProduct =await newProduct.save();
    res.status(200).json({data:savedProduct});
}));

//update

router.put("/:id",upload.single('productImage'),resizeImage
,verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res,next) => {
    
        const updatedProduct=await Products.findByIdAndUpdate(req.params.id,
            {
            $set:req.body
        },{new:true});
        if (!updatedProduct){
            return  next(new ApiError (`no product for this id: ${req.params.id}`));
        };
        const section= Section.findById(req.body.sections);
        if (!section){
            return  next(new ApiError (`no section for this id: ${req.body.sections}`));
        };

        res.status(200).json({data:updatedProduct});

}));

//delete

router.delete("/:id",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res,next) => {
    
       const product= await Products.findByIdAndDelete(req.params.id);
       if (!product){
       return  next(new ApiError (`no product for this id: ${req.params.id}`));
       }
       res.status(200).json("Product has been deleted");

}));

//get product

router.get("/find/:id",asyncHandler(async (req,res,next) => {
    
    const product= await Products.findById(req.params.id);
    if(!product){
        return    next(new ApiError (`no product for this id: ${req.params.id}`));
    }
    res.status(200).json({data:product});
    
}));


//get all products

router.get("/",asyncHandler(async (req,res) => {
    const qNew =req.query.new;
    const qSection =req.query.sections;
    const page=req.query.page * 1 || 1;
    const limit =req.query.limit * 1 || 5 ;
    const skip=(page - 1) * limit;//(2-1)*5 =5
    
    
        let products;
        if(qNew){
            products=await Products.find().sort({createdAt:-1}).skip(skip).limit(limit);

        }else if(qSection){
            products=await Products.find({sections:{$in:[qSection],}}).skip(skip).limit(limit)
        }else{
            products=await Products.find().skip(skip).limit(limit);
        }
        res.status(200).json({results:products.length,page,data:products});
    

}));


module.exports= router;