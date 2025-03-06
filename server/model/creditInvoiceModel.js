const mongoose = require("mongoose");

const CreditInvoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  assignTo: { type: String, required: true }, 
  billingWeek: { type: String, required: true }, 
  invoiceDate: { type: Date, default: Date.now },
  bills: [
    {
      billId: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" },
      billDate: { type: Date, required: true },
      grandTotal: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
});

module.exports = mongoose.model("CreditInvoice", CreditInvoiceSchema);
