const Product=require("../model/product")
const RawMaterial=require("../model/rawMaterial")

const addProductAndDeductRawMaterial=async(req,res)=>{
    try {
        const { products, rawMaterials } = req.body; // Separate arrays for products and raw materials
        const userId = req.user.id; // User ID from authentication middleware

        // Validate raw material availability
        for (const item of rawMaterials) {
            const rawMaterial = await RawMaterial.findOne({ name: item.name, userId });

            if (!rawMaterial || rawMaterial.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
            }
        }

        // Deduct raw material stock after validation
        for (const item of rawMaterials) {
            await RawMaterial.updateOne(
                { name: item.name, userId },
                { $inc: { quantity: -item.quantity } }
            );
        }

        // Process products (merge if exists, insert if new)
        for (const product of products) {
            const existingProduct = await Product.findOne({ name: product.name, userId });

            if (existingProduct) {
                // Merge product: Update quantity & set new price
                existingProduct.quantity += product.quantity;
                existingProduct.price = product.price;
                await existingProduct.save();
            } else {
                // Insert new product
                const newProduct = new Product({
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    userId
                });
                await newProduct.save();
            }
        }

        res.status(201).json({ message: "Products added/updated and raw materials deducted successfully!" });
    } catch (error) {
        console.error("Error adding products:", error);
        res.status(500).json({ message: "Server error" });
    }

}

const getAllProduct=async(req,res)=>{
    try {
        const userId=req.user.id
        const products=await Product.find({userId})
        res.json(products)
    } catch (error) {
        res.status(500).json({message:"error in fetching raw material"},error)
    }
}

const deleteProduct=async(req,res)=>{
    try {
        const userId=req.user.id
        const id=req.params.id

        const product=await Product.findOneAndDelete({_id:id,userId})

        if(!product)
        {
            return res.status(404).json({message:"Product not found"})
        }
        res.json({message:"Deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"Error to deleting product",error})
    }
}


module.exports={addProductAndDeductRawMaterial,getAllProduct,deleteProduct}