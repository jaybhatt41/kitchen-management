const ProductMaster=require("../model/productMasterModel")
const addProductMaster=async(req,res)=>{
    try {
        const {products}=req.body;
        const userId=req.user.id
        if(!products || products.length === 0)
        {
            return res.status(400).json({message:"No Products Provided"})
        }
        const savedProducs=await ProductMaster.insertMany(
            products.map((item)=>({name:item.name,userId:userId}))
        )
        res.status(201).json({message:"Products Added successfully",savedProducs})
    } catch (error) {
        res.status(500).json({message:"Error for adding Product master",error})
    }
}

const getAllProductMaster=async(req,res)=>{
    try {
        const userId = req.user.id; 
        const products = await ProductMaster.find({ userId }); 
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
      }
}

const updateProductMaster=async(req,res)=>{
    try {
        const userId = req.user.id;
        const { name } = req.body;
    
        const updateProduct = await ProductMaster.findOneAndUpdate(
          { _id: req.params.id, userId }, 
          { name },
          { new: true }
        );
    
        if (!updateProduct) {
          return res.status(404).json({ message: "Product not found." });
        }
    
        res.status(200).json(updateProduct);
      } catch (error) {
        res.status(500).json({ message: "Failed to update Product" });
      }
}

const deleteProductMaster=async(req,res)=>{
    try {
        const userId = req.user.id;
    
        const deleteProduct = await ProductMaster.findOneAndDelete({
          _id: req.params.id,
          userId,
        });
    
        if (!deleteProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
    
        res.status(200).json({ message: "Products deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete raw material" });
      }
}

module.exports={addProductMaster,getAllProductMaster,updateProductMaster,deleteProductMaster}