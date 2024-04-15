const Products = require("./../models/products");
const verifyToken= require("./verifyToken");
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const ApiError = require("./../utils/apiError");

//create   !!!!!!!!!!
router.post("/",verifyToken.verifyTokenAndManager,asyncHandler(async(req,res)=>{
const newProduct= new Products(req.body)

    const savedProduct =await newProduct.save();
    res.status(200).json({data:savedProduct});
}));

//update

router.put("/:id",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res,next) => {
    
        const updatedProduct=await Products.findByIdAndUpdate(req.params.id,
            {
            $set:req.body
        },{new:true});
        if (!updatedProduct){
            return  next(new ApiError (`no product for this id: ${req.params.id}`));
        }
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