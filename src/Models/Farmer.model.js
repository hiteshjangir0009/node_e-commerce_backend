import mongoose from "mongoose";

const FarmerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

export const Farmer = mongoose.model("Farmer", FarmerSchema);