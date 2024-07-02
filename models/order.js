const mongoose= require('mongoose');
const orderSchema =new mongoose.Schema(
    {
    
    orderItems: [
        {
        product:{ 
            type:mongoose.Schema.ObjectId,
            ref:"products",            
        },
        quantity:{
            type:Number,
            default:1
        },
        color:String,
        price:Number,              
            
        },

    ],
    client:{
        type:mongoose.Schema.ObjectId,
            ref:"client",
    },

    totalPrice:{
        type:Number,
       // require:true,
        default:0
    },

    address:{type:String},
    status:{
        type:String,
        default:"pending"
    },

},
{timestamps:true});

module.exports=mongoose.model("Order",orderSchema);
