const CreditInvoice = require("../model/creditInvoiceModel");
const Bill = require("../model/billmodel");
const moment = require("moment");

// 📌 Generate Credit Invoice (Automatically Runs Weekly)
const generateWeeklyCreditInvoices = async () => {
  try {
    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();
    const billingWeek = moment().format("YYYY-[W]WW"); // e.g., "2025-W09"

    // Fetch all bills grouped by userId & assignTo
    const bills = await Bill.aggregate([
      { $match: { billDate: { $gte: startOfWeek, $lte: endOfWeek } } },
      { $group: { _id: { userId: "$userId", assignTo: "$assignTo" }, bills: { $push: "$$ROOT" } } }
    ]);

    // Generate invoices for each user & category
    for (const entry of bills) {
      const { userId, assignTo } = entry._id;
      const userBills = entry.bills;

      const totalAmount = userBills.reduce((sum, bill) => sum + bill.grandTotal, 0);

      const creditInvoice = new CreditInvoice({
        userId,
        assignTo,
        billingWeek,
        bills: userBills.map(({ _id, billDate, grandTotal }) => ({
          billId: _id,
          billDate,
          grandTotal,
        })),
        totalAmount,
        paymentStatus: "Pending",
      });

      await creditInvoice.save();
    }

    console.log("✅ Weekly Credit Invoices Generated!");
  } catch (error) {
    console.error("❌ Error generating credit invoices:", error);
  }
};

// 📌 Get Credit Invoices (User-Wise)
const getUserCreditInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoices = await CreditInvoice.find({ userId }).populate("bills.billId");

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// 📌 Update Payment Status
const updatePaymentStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { status } = req.body;

    const updatedInvoice = await CreditInvoice.findByIdAndUpdate(
      invoiceId,
      { paymentStatus: status },
      { new: true }
    );

    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: "Error updating payment status", error });
  }
};

module.exports = { generateWeeklyCreditInvoices, getUserCreditInvoices, updatePaymentStatus };
