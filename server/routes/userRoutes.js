const express=require("express")
const {registerUser, verifyOtp, loginUser} =require("../controller/userController")
const {authenticate}=require("../middleware/authenticate")
const router=express.Router()

router.post("/register",registerUser)
router.post("/verify",verifyOtp)
router.post("/login",loginUser)

router.get("/dashboard",authenticate,(req,res)=>{
    res.status(200).json({msg:"welcome to dashboard"})
})

module.exports=router