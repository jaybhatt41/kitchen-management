const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  distributionId: { type: mongoose.Schema.Types.ObjectId, ref: "Distribution", required: true },
  assignTo: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      subtotal: { type: Number, required: true }, 
    }
  ],
  grandTotal: { type: Number, required: true }, 
  paymentStatus: { 
    type: String, 
    enum: ["Pending", "Paid"], 
    default: "Pending" 
  }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bill", BillSchema);
