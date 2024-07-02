const mongoose= require("mongoose");
const designSchema= new mongoose.Schema(
    {
        designName:{
            type:String,
            required:true,
            trim:true
        },
        designDescription:{
            type:String,
            
            trim:true
        },
        
        designImage:{
            type:String,
            required:true
        },
        designer:{
            type:mongoose.Schema.ObjectId,
            ref:"designer"
        }
    
    },
    {timestamps:true}
    );

    module.exports=mongoose.model("design",designSchema);
