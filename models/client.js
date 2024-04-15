const mongoose= require("mongoose");
const clientSchema=new mongoose.Schema(
    {
        clientName:{
            type:String,
            required:true
        },
        clientEmail:{
            type:String,
            required:true,
            unique:true            
        },
        clientPassword:{
            type:String,
            required:true
        },
        clientPhoneNmber:{
            type:String,
            //required:true
        },
        clientAddress:{
            type:String,
           // required:true
        },
        clientGender:{
            type:String
        },
        clientBirthday:{
            type:Date            
        },

        isManager:{
            type:Boolean,
            default:false
        },
        isDesigner:{
            type:Boolean,
            default:false}
    
    },
    
    {timestamps:true}
);

module.exports=mongoose.model("Client",clientSchema);