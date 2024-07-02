const Order = require("./../models/order");
const products = require("./../models/products");
const asyncHandler = require('express-async-handler');
const ApiError = require("./../utils/apiError");
const authService = require('./ath');
const verifyToken= require("./verifyToken");
const router = require('express').Router();



const calcTotalCartPrice = (Order) => {
    let totalprice = 0;
    Order.orderItems.forEach((item) => {
       totalprice += item.quantity * item.price;
     });
     Order.totalPrice = totalprice;
    return totalprice;
  };

//create  
router.post("/", /*authService.allowedTo('user')verifyToken.verifyTokenAndAuthorization,*/

asyncHandler(async (req, res, next) => {
    const {productId,productColor}=req.body;
    const product=await products.findById(productId);
  
    // 1) Get Cart for logged user
    let cart = await Order.findOne({ client:req.client._id });
  
    if (!cart) {
      // create cart fot logged user with product
      cart = await Order.create({
        client:req.client._id,
        orderItems:[{product:productId,color:productColor,price:product.productPrice}]
      });
    } else {
      // product exist in cart, update product quantity
      const productIndex = cart.orderItems.findIndex(
        (item) => item.product.toString() === productId && item.color === productColor
      );
  
      if (productIndex > -1) {
        const cartItem = cart.orderItems[productIndex];
        cartItem.quantity += 1;
  
        cart.cartItems[productIndex] = cartItem;
      } else {
        // product not exist in cart,  push product to cartItems array
        cart.cartItems.push({ product:productId,color:productColor,price:product.productPrice });
      }
    }
  
    // Calculate total cart price
    calcTotalCartPrice(order);
    await cart.save();
  
    res.status(200).json({
      status: 'success',
      message: 'Product added to cart successfully',
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
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
            };
            const clientid= clients.findById(req.body.clientId);
            if (!clientid){
                return  next(new ApiError (`no section for this id: ${req.body.clientId}`));
            };    
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