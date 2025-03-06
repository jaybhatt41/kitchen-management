const mongoose=require("mongoose")
const productMasterSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})
module.exports=mongoose.model("ProductMaster",productMasterSchema)