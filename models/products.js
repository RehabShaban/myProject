const mongoose= require("mongoose");
const productSchema= new mongoose.Schema(
    {
        productName:{
            type:String,
            required:true,
            trim:true
        },
        productDescription:{
            type:String,
            required:true,
            trim:true
        },
        productPrice:{
            type:Number,
            required:true
        },
        //productPriceDiscount:Number,
        productImage:{
            type:String,
            required:true
        },
        //productImages:[String],
        
        sections:{
    type:mongoose.Schema.ObjectId,
            ref:"Section",
        // required:true
    },
        
        inStock:{
            type:Boolean,
            default:true
        },
        productColor:{
            type:String,
            
        },
        productSize:{
            type:Array,           
        },
        productAmount:{
            type:Number,
            required:true
        },

        Sold:{
            type:Number,
            default:0,
        },
        productRating:{
            type:Number,
            
        }, 
     
    },
      {timestamps:true}
     );

     module.exports=mongoose.model("Product",productSchema);
