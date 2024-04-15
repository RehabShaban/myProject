const mongoose= require("mongoose");
const designerSchema=new mongoose.Schema(
    {
        designerName:{
            type:String,
            required:true,
            unique:true,
        },
        designerEmail:{
            type:String,
            required:true
        },
        designerPassword:{
            type:String,
            required:true
        },
        designerPhoneNmber:{
            type:String,
            required:true
        },
        designerAddress:{
            type:String,
            required:true
        },
        designerGender:{
            type:String
        },
        /*managerId:{
            type:mongoose.Schema.ObjectId,
            ref:"Manager",
            required:true,
            unique:true,
        },*/
        
        isClient:{
            type:Boolean,
            default:false
        },
        isManager:{
            type:Boolean,
            default:false}
    
    },
    {timestamps:true}
);

module.exports=mongoose.model("Designer",designerSchema);