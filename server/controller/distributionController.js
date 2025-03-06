const distribution = require("../model/distribution");
const Distribution =require("../model/distribution")
const Product=require("../model/product")
const { createBill } = require("../controller/billController");

const addDistribution=async(req,res)=>{
  try {
    const { assignTo, products } = req.body;
    const userId = req.user.id;

    // Check for duplicate products
    const productIds = new Set();
    for (const item of products) {
      if (productIds.has(item.productId)) {
        return res.status(400).json({ message: "Duplicate product found. Combine them into a single entry." });
      }
      productIds.add(item.productId);
    }

    // Validate stock availability
    for (const item of products) {
      const product = await Product.findOne({ _id: item.productId, userId });
      if (!product) return res.status(404).json({ message: `Product not found for ID: ${item.productId}` });
      if (item.quantity > product.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}` });
      }
    }

    // Deduct stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.quantity } });
    }

    // Create new distribution
    const newDistribution = new Distribution({ userId, assignTo, products });
    const savedDistribution = await newDistribution.save();

    // Create bill (Calling Bill Controller)
    const billResponse = await createBill(savedDistribution);

    res.status(201).json({ message: "Distribution recorded successfully", bill: billResponse });
  } catch (error) {
    console.error("Error adding distribution:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
const getAllDistributions=async(req,res)=>{
  try {
    const userId=req.user.id
    const distributions=await Distribution.find({userId})
          .populate("products.productId","name")
          .sort({distributionDate:-1})
          res.json(distributions)
  } catch (error) {
    console.log("error of fetching distribution",error);
    res.status(500).json({message:"Error of fetching distribution",error})
    
  }
}

const deleteDistribution=async(req,res)=>{
  try {
    
  const userId=req.user.id
  const {id}=req.params
  const distribution=await Distribution.findOneAndDelete({_id:id,userId})
  
  if(!distribution)
  {
    return res.status(404).json({message:"Distribution not found"})
  }
  res.json({message:"Deleted successfully"})
  } catch (error) {
    console.log("Error to deleting distribution",error);
    res.status(500).json({message:"Error to deleting distribution",error})
  }
}
module.exports={addDistribution,getAllDistributions,deleteDistribution}