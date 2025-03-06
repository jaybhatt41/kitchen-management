const Purchase=require("../model/purchase")
const PDFDocument=require("pdfkit")
const fs=require("fs")
const path=require("path")
const purchase = require("../model/purchase")
const { json } = require("body-parser")

const getAllPurchases=async(req,res)=>{
    try {
        const userId=req.user.id
        const purchses=await Purchase.find({userId}).sort({createAt:-1})

        const groupedPurchases=purchses.reduce((acc,purchase)=>{
            const date=new Date(purchase.createAt).toISOString().split("T")[0]
            if(!acc[date])
            {
                acc[date]=[]
            }
            acc[date].push(purchase)
            return acc
        },{})
        res.json(groupedPurchases)
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:"Internal server Error",error})
    }
}

const generatePurchasePDF = async (req, res) => {
    try {
        const { date } = req.params;
        const userId = req.user.id; // Assuming user ID comes from auth middleware

        // Validate the date parameter
        if (!date || isNaN(Date.parse(date))) {
            return res.status(400).json({ message: "Invalid date format." });
        }

        // Convert the date string into a valid Date object
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const startOfDay = new Date(targetDate);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch purchases for the specific date
        const purchases = await Purchase.find({
            userId,
            createAt: { $gte: startOfDay, $lte: endOfDay },
        });

        if (!purchases.length) {
            return res.status(404).json({ message: "No purchases found for this date." });
        }

        // Create PDF
        const doc = new PDFDocument({ margin: 30 });
        const fileName = `Purchases_${date}.pdf`;
        const filePath = path.join(__dirname, `../purchasePDFs/${fileName}`);

        doc.pipe(fs.createWriteStream(filePath)); // Save file on server
        doc.pipe(res); // Send response to frontend

        // PDF Title
        doc.fontSize(16).text(`Purchases on ${date}`, { align: "center", underline: true });
        doc.moveDown(2);

        // Table Header with proper column spacing
        doc.fontSize(12).font("Helvetica-Bold");
        let startX = 50, startY = doc.y; // Define X position for columns

        doc.text("No.", startX, startY, { width: 40 });
        doc.text("Name", startX + 50, startY, { width: 150 });
        doc.text("Quantity", startX + 200, startY, { width: 80 });
        doc.text("Unit", startX + 300, startY, { width: 80 });
        doc.text("Cost", startX + 400, startY, { width: 80 });

        doc.moveDown(0.5);
        doc.strokeColor("#000").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Draw line
        doc.moveDown(0.5);

        doc.font("Helvetica"); // Reset font for table rows

        let totalCost = 0;

        // Purchase Items
        purchases.forEach((purchase, index) => {
            let rowY = doc.y;

            doc.text(index + 1, startX, rowY, { width: 40 });
            doc.text(purchase.name, startX + 50, rowY, { width: 150 });
            doc.text(purchase.quantity.toString(), startX + 200, rowY, { width: 80 });
            doc.text(purchase.unit, startX + 300, rowY, { width: 80 });
            doc.text(`${purchase.cost.toFixed(2)}`, startX + 400, rowY, { width: 80 });

            totalCost += purchase.cost;
            doc.moveDown(0.5);
        });

        doc.moveDown(0.5);
        doc.strokeColor("#000").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Draw line

        // Total Cost
        doc.moveDown(0.5);
        doc.fontSize(14).font("Helvetica-Bold").text(`Total Cost: ${totalCost.toFixed(2)}`, startX + 200);

        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


  
module.exports={getAllPurchases,generatePurchasePDF}