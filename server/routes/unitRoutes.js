const express =require("express")
const {getUnits}=require("../controller/unitController")
const router=express.Router()
router.get("/",getUnits)

module.exports=router