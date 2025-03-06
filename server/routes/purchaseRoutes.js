const express=require("express")
const {getAllPurchases,generatePurchasePDF}=require("../controller/purchaseController")
const {authenticate}=require("../middleware/authenticate")
const router=express.Router()

router.use(authenticate)
router.get("/",getAllPurchases)
router.get("/gen-pdf/:date",generatePurchasePDF)

module.exports=router