const express = require("express");
const { downloadBillPDF, getAllBills } = require("../controller/billController");
const {authenticate}=require("../middleware/authenticate")
const router = express.Router();

router.use(authenticate)
router.get("/pdf/:id", downloadBillPDF);
router.get("/", getAllBills);

module.exports = router;
