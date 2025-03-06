const RawMaterial = require("../model/rawMaterial")
const Purchase = require("../model/purchase")

const addRawMaterial=async(req,res)=>{
    try {
        const {materials}=req.body
        const userId=req.user.id

        for(const material of materials)
        {
            const {name,quantity,unit,cost}=material
            const newPurchase=new Purchase({name,quantity,unit,cost,userId})
            await newPurchase.save()

            let existingMaterial=await RawMaterial.findOne({name,unit,userId})

            if(existingMaterial)
            {
                const newQuantity=existingMaterial.quantity+quantity
                const newCost=((existingMaterial.quantity * existingMaterial.cost)+(quantity * cost))/newQuantity

                existingMaterial.quantity=newQuantity
                existingMaterial.cost=newCost
                await existingMaterial.save()
            }
            else
            {
                const newMaterial=new RawMaterial({name,quantity,unit,cost,userId})
                await newMaterial.save()
            }
        }
        res.status(200).json("Raw Material added successfully")
    } catch (error) {
        res.status(500).json({message:"Error for addedng raw material",error})
    }
}

const getRawMaterial=async(req,res)=>{
    try {
        const userId=req.user.id
        const rawMaterials= await RawMaterial.find({userId})
        res.status(200).json(rawMaterials)
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:"Failed to fetch Raw material",error})
    }
}

const deleteRawMaterial=async(req,res)=>
{
    try {
        const {id}=req.params
        const userId=req.user.id

        const deletedRawMaterial=await RawMaterial.findOneAndDelete({_id:id,userId})

        if(!deletedRawMaterial)
        {
            return res.status(404).json({message:"Raw Material not found"})

        }
        res.status(200).json({message:"Deleted Successfully"})
    } catch (error) {
        res.status(500).json({messsage:"Error for deleting Raw material",error})
    }
}

module.exports={addRawMaterial,getRawMaterial,deleteRawMaterial}