const express=require("express")
const {addDistribution,getAllDistributions,deleteDistribution}=require("../controller/distributionController")
const {authenticate}=require("../middleware/authenticate")

const router=express.Router()

router.use(authenticate)
router.post("/add",addDistribution)
router.get("/",getAllDistributions)
router.delete("/:id",deleteDistribution)

module.exports=router