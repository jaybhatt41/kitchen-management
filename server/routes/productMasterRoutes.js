const express=require("express")
const {addProductMaster,getAllProductMaster, updateProductMaster, deleteProductMaster}=require("../controller/productMaster")
const {authenticate}=require("../middleware/authenticate")

const router=express.Router()

router.use(authenticate)
router.post("/add",addProductMaster)
router.get("/",getAllProductMaster)
router.put("/:id",updateProductMaster)
router.delete("/:id",deleteProductMaster)


module.exports=router