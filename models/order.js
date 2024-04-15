const mongoose= require('mongoose');
const orderSchema =new mongoose.Schema(
    {
    clientId:{
        type:String,
        required:true,
    },

    products: [
        {
        productId:{ 
            type:String
            
        },
        quantity:{
                type:Number,
                default:1
            }
        },

    ],
    
    totalPrice:{
        type:Number,
        require:true,
        default:0
    },
    address:{type:Object,required:true},
    status:{
        type:String,
        default:"pending"
    },

},
{timestamps:true});

module.exports=mongoose.model("Order",orderSchema);
