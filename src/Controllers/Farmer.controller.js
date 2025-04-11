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

// Delete Farmer by ID
const Delete_Farmer = Async_handler(async (req, res) => {
    const { id } = req.body;

    // Check if ID is provided
    if (!id) {
        return res.status(400).json(new API_response(400, [], "Farmer ID is required"));
    }

    // Attempt to delete the farmer
    const deletedFarmer = await Farmer.findByIdAndDelete(id);

    // If farmer not found
    if (!deletedFarmer) {
        return res.status(404).json(new API_response(404, [], "Farmer not found"));
    }

    return res.status(200).json(new API_response(200, deletedFarmer, "Farmer deleted successfully"));
});


export { Add_Farmer, Get_All_Farmers,Delete_Farmer };