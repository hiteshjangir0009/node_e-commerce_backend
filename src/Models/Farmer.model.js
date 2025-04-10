import mongoose from "mongoose";

const FarmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    landSize: { type: Number, required: true },
    crops: { type: String, required: true },
}, { timestamps: true });

export const Farmer = mongoose.model("Farmer", FarmerSchema);