const Bill = require("../model/billmodel");
const PDFDocument = require("pdfkit");
const Product = require("../model/product");
const path = require("path");
const fs=require("fs")


const createBill = async (distribution) => {
    try {
      let grandTotal = 0;
  
      // ✅ Fetch product names before saving the bill
      const processedProducts = await Promise.all(
        distribution.products.map(async (item) => {
          const product = await Product.findById(item.productId);
          if (!product) throw new Error(`Product not found for ID: ${item.productId}`);
  
          const subtotal = item.quantity * item.price;
          grandTotal += subtotal;
  
          return {
            productId: item.productId,
            name: product.name, // ✅ Store product name
            quantity: item.quantity,
            price: item.price,
            subtotal,
          };
        })
      );
  
      const newBill = new Bill({
        userId: distribution.userId,
        distributionId: distribution._id,
        assignTo: distribution.assignTo,
        products: processedProducts, // ✅ Save product names
        grandTotal,
        paymentStatus: "Pending",
      });
  
      await newBill.save();
      return { billId: newBill._id };
    } catch (error) {
      console.error("Error creating bill:", error);
      throw new Error("Bill creation failed");
    }
  };
  

  const downloadBillPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // ✅ Fetch bill and populate product names
        const bill = await Bill.findOne({ _id: id, userId })
            .populate("products.productId", "name"); // Fetch product names

        if (!bill) return res.status(404).json({ message: "Bill not found or unauthorized" });

        // ✅ Set up PDF document
        const doc = new PDFDocument({ margin: 50 });
        const fileName = `Bill_${bill._id}.pdf`;
        const filePath = path.join(__dirname, `../bill/${fileName}`);

        doc.pipe(fs.createWriteStream(filePath)); // Save file on server
        doc.pipe(res); // Send response to frontend

        // ✅ PDF Title
        doc.font("Helvetica-Bold").fontSize(18).text("Distribution Bill", { align: "center" });
        doc.moveDown(1);

        // ✅ Bill Details
        doc.fontSize(12).text(`Bill ID: ${bill._id}`);
        doc.text(`Assigned To: ${bill.assignTo}`);
        doc.text(`Date: ${new Date().toLocaleString()}`);
        doc.moveDown(1);

        // ✅ **Table Header**
        doc.font("Helvetica-Bold").fontSize(12);
        let startX = 50, startY = doc.y;

        doc.text("Product", startX, startY, { width: 200 });
        doc.text("Quantity", startX + 200, startY, { width: 100, align: "center" });
        doc.text("Price", startX + 300, startY, { width: 100, align: "right" });
        doc.text("Subtotal", startX + 400, startY, { width: 100, align: "right" });

        doc.moveDown(0.5);
        doc.strokeColor("#000").moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // ✅ Header underline
        doc.moveDown(0.5);

        // ✅ **Table Data**
        doc.font("Helvetica").fontSize(12);
        let totalCost = 0;

        bill.products.forEach((item) => {
            let rowY = doc.y;
            const productName = item.productId?.name || "Unknown"; // ✅ Fetch name safely

            doc.text(productName, startX, rowY, { width: 200 });
            doc.text(item.quantity.toString(), startX + 200, rowY, { width: 100, align: "center" });
            doc.text(`${item.price.toFixed(2)}`, startX + 300, rowY, { width: 100, align: "right" });
            doc.text(`${item.subtotal.toFixed(2)}`, startX + 400, rowY, { width: 100, align: "right" });

            totalCost += item.subtotal;
            doc.moveDown(0.5);
        });

        doc.moveDown(0.5);
        doc.strokeColor("#000").moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // ✅ Separator

        // ✅ **Total Amount**
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(14).text(`Grand Total: ${totalCost.toFixed(2)}`, startX + 300);
        doc.text(`Payment Status: ${bill.paymentStatus}`, startX + 300, doc.y + 20);

        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Failed to generate PDF" });
    }
}

const getAllBills = async (req, res) => {
    try {
        const userId = req.user.id;

        // ✅ Fetch all bills for the logged-in user
        const bills = await Bill.find({ userId })
            .populate("products.productId", "name") // Populate product names
            .sort({ createdAt: -1 }); // Sort by most recent

        if (!bills.length) return res.status(404).json({ message: "No bills found" });

        res.status(200).json(bills);
    } catch (error) {
        console.error("Error fetching bills:", error);
        res.status(500).json({ message: "Failed to fetch bills" });
    }
};

module.exports = { createBill, downloadBillPDF,getAllBills };
