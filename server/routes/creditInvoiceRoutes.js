const express = require("express");
const { getUserCreditInvoices, updatePaymentStatus } = require("../controller/creditInvoiceController")
const {authenticate}=require("../middleware/authenticate")

const router = express.Router();

router.use(authenticate)
router.get("/", getUserCreditInvoices); 
router.put("/:invoiceId", updatePaymentStatus); 

module.exports = router;
