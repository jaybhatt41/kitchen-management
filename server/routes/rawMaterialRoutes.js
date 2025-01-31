const express=require("express")
const {createRawMaterial,getAllRawMaterial,updateRawMaterial,deleteRawMaterial}=require("../controller/rawMaterialController")
const {authenticate}=require("../middleware/authenticate")

const router=express.Router()

router.post("/add",authenticate,createRawMaterial)
router.get("/",authenticate,getAllRawMaterial)
router.put("/update/:id",authenticate,updateRawMaterial)
router.delete("/delete/:id",authenticate,deleteRawMaterial)

module.exports=router