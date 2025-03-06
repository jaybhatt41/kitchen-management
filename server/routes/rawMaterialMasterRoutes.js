const express=require("express")
const {addRawMaterialMaster,
    getAllRawMaterialMaster,
    updateRawMaterialMaster,
    deleteRawMaterialMaster}=require("../controller/rawMaterialMasterController")
const {authenticate}=require("../middleware/authenticate")

const router=express.Router()

router.use(authenticate)
router.post("/add",addRawMaterialMaster)
router.get("/",getAllRawMaterialMaster)
router.put("/:id",updateRawMaterialMaster)
router.delete("/:id",deleteRawMaterialMaster)

module.exports=router