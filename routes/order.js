const Order = require("./../models/order");
const verifyToken= require("./verifyToken");
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const ApiError = require("./../utils/apiError");


//create  
router.post("/",verifyToken.verifyToken,asyncHandler(async(req,res)=>{
const newOrder= new Order(req.body);
    const savedOrder=await newOrder.save();
    res.status(200).json({data:savedOrder});

}));

//update

router.put("/:id",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res,next) => {
    
        const updatedOrder=await Order.findByIdAndUpdate(req.params.id,
            {
            $set:req.body
            },{new:true});

        if (!updatedOrder){
                return  next(new ApiError (`no order for this id: ${req.params.id}`));
            }
        res.status(200).json({data:updatedOrder});
    

}));

// //delete

router.delete("/:id",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res,next) => {
    
    const order = await Order.findByIdAndDelete(req.params.id);

    if(!order){
        return  next(new ApiError (`no order for this id: ${req.params.id}`));
        }
        res.status(200).json("Order has been deleted");    

}));

//get Order

router.get("/find/:clientId",verifyToken.verifyTokenAndAuthorization,
asyncHandler(async (req,res,next) => {
    const page=req.query.page * 1 || 1;
        const limit =req.query.limit * 1 || 5 ;
        const skip=(page - 1) * limit;//(2-1)*5 =5
    
    const orders= await Order.find({clientId:req.params.clientId}).skip(skip).limit(limit);

    if (!orders){
        return next(new ApiError (`no orders for this id: ${req.params.clientId}`));
        }
        res.status(200).json({results:orders.length,page,data:orders});
    
    

}));


// //get all 

router.get("/",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res) => {

    const page=req.query.page * 1 || 1;
    const limit =req.query.limit * 1 || 5 ;
    const skip=(page - 1) * limit;//(2-1)*5 =5

    const orders= await Order.find().skip(skip).limit(limit);
    res.status(200).json({results:orders.length,page,data:orders});
    
    

}));

//get monthly income
router.get("/income",verifyToken.verifyTokenAndManager,
asyncHandler(async (req,res) => {
    const date = new Date();
    const lastMonth = new Date (date.setMonth(date.getMonth() -1));
    const previousMonth = new Date (new Date().setMonth(lastMonth.getMonth() -1));

            const income = await Order.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {$project:{month:{$month:"$createdAt"},sales:"$totalPrice",},},
            {
                $group:{
                    _id:"$month",
                    total:{$sum:"$sales"},
                },
            },
            ]);
            res.status(200).json({data:income});
   
}));




module.exports= router;