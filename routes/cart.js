const Cart = require("./../models/cart");
const verifyToken= require("./verifyToken");
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const ApiError = require("./../utils/apiError");

//create   
router.post("/",verifyToken.verifyToken,asyncHandler(async(req,res)=>{

    const newCart= new Cart(req.body);
    const savedCart=await newCart.save();
    res.status(200).json({data:savedCart});

}));

//update

router.put("/:id",verifyToken.verifyTokenAndAuthorization,
asyncHandler(async (req,res,next) => {
    
        const updatedCart=await Cart.findByIdAndUpdate(req.params.id,
            {
            $set:req.body
            },{new:true});
            
            if (!updatedCart){
                return  next(new ApiError (`no cart for this id: ${req.params.id}`));
                }
            res.status(200).json({data:updatedCart});
            

}));

// //delete

router.delete("/:id",verifyToken.verifyTokenAndAuthorization,
asyncHandler(async (req,res,next) => {
    
    const cart = await Cart.findByIdAndDelete(req.params.id);
        if(!cart){
            return  next(new ApiError (`no cart for this id: ${req.params.id}`));
            }
        
        res.status(200).json("Cart has been deleted");

}));

// //get cart

router.get("/find/:clientId",verifyToken.verifyTokenAndAuthorization,
asyncHandler(async (req,res,next) => {
    
    const cart= await Cart.findOne({clientId:req.params.clientId});
    if (!cart){
        return next(new ApiError (`no cart for this id: ${req.params.id}`));
        }
    
    res.status(200).json({data:cart});
    

}));


// //get all 

router.get("/",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res) => {

    
    const page=req.query.page * 1 || 1;
    const limit =req.query.limit * 1 || 5 ;
    const skip=(page - 1) * limit;//(2-1)*5 =5

    const carts= await Cart.find().skip(skip).limit(limit);
    res.status(200).json({results:carts.length,page,data:carts});


}));




module.exports= router;