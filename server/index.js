require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const userRoutes=require("./routes/userRoutes")
const unitRoutes =require("./routes/unitRoutes")
const rawMaterialRoutes=require("./routes/rawMaterialRoutes")
const cors=require("cors")
const URL=process.env.MONGO_URL
const app=express()

app.use(bodyParser.json())
app.use(cors())
app.use("/api/user",userRoutes)
app.use("/api/unit",unitRoutes)
app.use("/api/raw-material",rawMaterialRoutes)

mongoose.connect(URL)
        .then(()=>{
            console.log("mongodb connected");
            
        })
        .catch(err=>console.log("could not coonected to mongoDB",err)
        )

app.listen(process.env.PORT,()=>{
    console.log(`server is started at ${process.env.PORT}`);
    
})