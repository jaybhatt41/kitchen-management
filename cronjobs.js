const cron = require("node-cron");
const { generateWeeklyCreditInvoices } = require("./controllers/creditInvoiceController");

// Runs every Monday at 12 AM
cron.schedule("0 0 * * 1", async () => {
  console.log("🔄 Running weekly credit invoice generation...");
  await generateWeeklyCreditInvoices();
});
