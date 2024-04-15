const mongoose= require('mongoose');
const cartSchema =new mongoose.Schema({

    clientId:{
        type:String,
        required:true
    },

    products: [
        {
        productId:{ 
            type:String,
            required:true
        },
        quantity:{
                type:Number,
                default:1
            }
        },

    ],
    /*orderId:{

        type:mongoose.Schema.ObjectId,
        ref:"Order"
    },
    priceTotal:{
        type:Number,
        default:0
    },*/

},
{timestamps:true}
);

module.exports=mongoose.model("Cart",cartSchema);
//const cartModle=mongoose.model("Cart");
