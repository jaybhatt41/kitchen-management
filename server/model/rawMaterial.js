const mongoose=require("mongoose")
const rawMaterialSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    unit:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})
module.exports=mongoose.model("RawMaterial",rawMaterialSchema)