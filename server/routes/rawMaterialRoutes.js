const express=require("express")
const {addRawMaterial,getRawMaterial,deleteRawMaterial}=require("../controller/rawMaterial")
const {authenticate}=require("../middleware/authenticate")
const router=express.Router()

router.use(authenticate)
router.post("/add",addRawMaterial)
router.get("/",getRawMaterial)
router.delete("/:id",deleteRawMaterial)


module.exports=router

