const RawMaterial = require("../model/rawMaterial")

const createRawMaterial=async(req,res)=>{
    try {
        const {name,unit}=req.body
        const userId=req.user.id
        console.log(userId);
        
        const existingRawMaterial=await RawMaterial.findOne({name,userId})
        if(existingRawMaterial)
        {
            return res.status(400).json({error:"Raw Material already exists"})
        }
        const rawMaterial=new RawMaterial({name,unit,userId})
        const savedMaterial=await rawMaterial.save()
        res.status(200).json({message:"Raw Material added successfully",savedMaterial})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const getAllRawMaterial=async(req,res)=>{
    try {
        const userId=req.user.id
        const rawMaterials=await RawMaterial.find({userId})
        if(!rawMaterials)
        {
            return res.status(404).json({error:"Raw Material not found"})
        }
        res.status(200).json(rawMaterials)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const updateRawMaterial=async(req,res)=>{
    try {
        const{name,unit}=req.body
        const userId=req.user.id
        const rawMaterialId=req.params.id
        const rawMaterial=await RawMaterial.findOne({_id:rawMaterialId,userId})
        if(!rawMaterial)
        {
            return res.status(404).json({error:"RawMaterial not found"})
        }
        rawMaterial.name=name || rawMaterial.name
        rawMaterial.unit=unit || rawMaterial.unit

        const updatedMaterial=await rawMaterial.save()
        res.status(200).json({message:"Raw material updated successfully",updatedMaterial})

    } catch (error) {
        res.status(400).json({error:error.messsge})
    }
}

const deleteRawMaterial=async(req,res)=>{
    try {
        const userId=req.user.id
        const rawMaterialId=req.params.id
        const rawMaterial=await RawMaterial.findOneAndDelete({_id:rawMaterialId,userId})
        if(!rawMaterial)
        {
            return res.status(404).json({error:"Raw Material not found"})
        }
        res.status(200).json({message:"Deleted successfully"})
    } catch (error) {
        res.status(200).json({error:error.message})
    }   

}
module.exports={createRawMaterial,getAllRawMaterial,updateRawMaterial,deleteRawMaterial}