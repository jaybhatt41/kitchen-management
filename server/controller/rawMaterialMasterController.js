const RawMaterialMaster=require("../model/rawMaterialMasterModel")
const addRawMaterialMaster=async(req,res)=>{
    try {
        const {materials}=req.body;
        const userId=req.user.id
        if(!materials || materials.length === 0)
        {
            return res.status(400).json({message:"No Materials Provided"})
        }
        const savedMaterials=await RawMaterialMaster.insertMany(
            materials.map((item)=>({name:item.name,userId:userId}))
        )
        res.status(201).json({message:"Materials Added successfully",savedMaterials})
    } catch (error) {
        res.status(500).json({message:"Error for adding material master",error})
    }
}

const getAllRawMaterialMaster=async(req,res)=>{
    try {
        const userId = req.user.id; 
        const materials = await RawMaterialMaster.find({ userId });
        res.status(200).json(materials);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch raw materials" });
      }
}

const updateRawMaterialMaster=async(req,res)=>{
    try {
        const userId = req.user.id;
        const { name } = req.body;
    
        const updatedMaterial = await RawMaterialMaster.findOneAndUpdate(
          { _id: req.params.id, userId }, 
          { name },
          { new: true }
        );
    
        if (!updatedMaterial) {
          return res.status(404).json({ message: "Raw material not found." });
        }
    
        res.status(200).json(updatedMaterial);
      } catch (error) {
        res.status(500).json({ message: "Failed to update raw material" });
      }
}

const deleteRawMaterialMaster=async(req,res)=>{
    try {
        const userId = req.user.id;
    
        const deletedMaterial = await RawMaterialMaster.findOneAndDelete({
          _id: req.params.id,
          userId,
        });
    
        if (!deletedMaterial) {
          return res.status(404).json({ message: "Raw material not found or unauthorized" });
        }
    
        res.status(200).json({ message: "Raw material deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete raw material" });
      }
    
}
module.exports={addRawMaterialMaster,getAllRawMaterialMaster,updateRawMaterialMaster,deleteRawMaterialMaster}