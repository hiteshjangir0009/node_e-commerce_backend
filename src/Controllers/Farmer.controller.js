import { Farmer } from "../Models/Farmer.model.js";
import { API_response } from "../Utils/API_response.js";
import { Async_handler } from "../Utils/Async_handler.js";

// Add Farmer
// Add Farmer
const Add_Farmer = Async_handler(async (req, res) => {
    const { name, phone, address, landSize, crops } = req.body;

    if (!name || !phone || !address || !landSize || !crops) {
        return res.status(400).json(new API_response(400, [], "All fields are required"));
    }

    const farmer = await Farmer.create({
        name,
        phone,
        address,
        landSize,
        crops
    });

    return res.status(201).json(new API_response(201, farmer, "Farmer added successfully"));
});


// Get All Farmers
const Get_All_Farmers = Async_handler(async (req, res) => {
    const farmers = await Farmer.find();
    return res.status(200).json(new API_response(200, farmers, "All farmers fetched successfully"));
});

export { Add_Farmer, Get_All_Farmers };