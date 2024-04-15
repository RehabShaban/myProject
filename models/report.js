const mongoose= require('mongoose');
const reportSchema =new mongoose.Schema({

    reportTitle:{
        type:String,
        required:true
    },
    reportDescription:{
    type:String,
    required:true
    },
    unfavorablePrice:{
        type:Boolean,
        default:false
    },
    badSurvice:{
        type:Boolean,
        default:false
    },


    clientId:{
       type:String,
       required:true
    },
   

},{timestamps:true}
);

module.exports=mongoose.model("Report",reportSchema);
