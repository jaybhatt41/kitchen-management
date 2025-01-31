const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    unit: {
        type: String,
        required: true,
        enum: ["kg", "gram", "mg", "ton", "lb", "oz", "liter", "ml", "piece", "dozen", "pair", "set", "unit"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("RawMaterial", rawMaterialSchema);
