require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const userRoutes=require("./routes/userRoutes")
const unitRoutes =require("./routes/unitRoutes")
const rawMaterialMasterRoutes=require("./routes/rawMaterialMasterRoutes")
const productMasterRouted=require("./routes/productMasterRoutes")
const rawMaterialRoutes=require("./routes/rawMaterialRoutes")
const purchaseRoutes=require("./routes/purchaseRoutes")
const productRoutes=require("./routes/productRoutes")
const distributionRoutes=require("./routes/distributionRoutes")
const billRoutes=require("./routes/billRoutes")
const creditInvoiceRoutes =require("./routes/creditInvoiceRoutes")
const cors=require("cors")
const URL=process.env.MONGO_URL
const app=express()

app.use(bodyParser.json())
app.use(cors())
app.use("/api/user",userRoutes)
app.use("/api/unit",unitRoutes)
app.use("/api/raw-material-master",rawMaterialMasterRoutes)
app.use("/api/product-master",productMasterRouted)
app.use("/api/raw-material",rawMaterialRoutes)
app.use("/api/purchase",purchaseRoutes)
app.use("/api/product",productRoutes)
app.use("/api/distribution",distributionRoutes)
app.use("/api/bill",billRoutes)
app.use("/api/creditInvoice",creditInvoiceRoutes)

mongoose.connect(URL)
        .then(()=>{
            console.log("mongodb connected");
            
        })
        .catch(err=>console.log("could not coonected to mongoDB",err)
        )

app.listen(process.env.PORT,()=>{
    console.log(`server is started at ${process.env.PORT}`);
    
})