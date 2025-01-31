const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
        default:null
    },
    otpExpiry:{
        type:String,
        default:null
    }
})
module.exports=mongoose.model("User",userSchema)
