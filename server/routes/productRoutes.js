const express=require("express")
const {addProductAndDeductRawMaterial,getAllProduct,deleteProduct}=require("../controller/product")
const {authenticate}=require("../middleware/authenticate")

const router=express.Router()

router.use(authenticate)
router.post("/add",addProductAndDeductRawMaterial)
router.get("/",getAllProduct)
router.delete("/:id",deleteProduct)

module.exports=router