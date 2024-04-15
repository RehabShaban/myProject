const mongoose= require("mongoose");
const managerSchema=new mongoose.Schema(
    {
        managerName:{
            type:String,
            required:true,
            undefined:true,
        },
        managerEmail:{
            type:String,
            required:true
        },
        managerPassword:{
            type:String,
            required:true
        },
        managerPhoneNmber:{
            type:String,
            required:true
        },
        managerAddress:{
            type:String,
            required:true
        },
        managerGender:{
            type:String
        },
        
        isClient:{
            type:Boolean,
            default:false
        },
        isDesigner:{
            type:Boolean,
            default:false}
    
    },
    {timestamps:true}
);

module.exports=mongoose.model("Manager",managerSchema);