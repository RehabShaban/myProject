const mongoose= require("mongoose");
//for schema 
//1- create schema
const SectionsSchema = new mongoose.Schema({
    sectionName:{
        type:String,
        required:true,
        unique:true,
    },
    sectionImage:{
        type:String,
       //
    },
    /*slug:{
        type:String,
        lowercase:true
    }*/
    
},{timestamps:true}
);



//2-create modle

const Sections =  mongoose.model('Sections', SectionsSchema);
module.exports=Sections;

