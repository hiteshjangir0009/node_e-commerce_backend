import { Checkout } from "../Models/Checkout.model.js";
import { API_response } from "../Utils/API_response.js";
import { Async_handler } from "../Utils/Async_handler.js";
import { User } from "../Models/User.model.js";


// Create Checkout
const CreateCheckout = Async_handler(async (req, res) => {
    const { cart, totalAmount, paymentStatus, shippingAddress } = req.body;
    const userId = req.user._id; // Assuming user is authenticated

    if (!cart || cart.length === 0 || !totalAmount || !shippingAddress) {
        return res.status(400).json(new API_response(400, [], "All fields are required"));
    }

    const checkout = await Checkout.create({
        user: userId,
        cart,
        totalAmount,
        paymentStatus: paymentStatus || "Pending",
        shippingAddress
    });

    return res.status(201).json(new API_response(201, checkout, "Checkout created successfully"));
});

// Get Checkout Details
const GetCheckout = Async_handler(async (req, res) => {
    const userId = req.user._id;
    const checkout = await Checkout.find({ user: userId });

    if (!checkout || checkout.length === 0) {
        return res.status(404).json(new API_response(404, [], "No checkout data found"));
    }

    return res.status(200).json(new API_response(200, checkout, "Checkout details fetched successfully"));
});

// Update Checkout Status
const UpdateCheckoutStatus = Async_handler(async (req, res) => {
    const { checkoutId, paymentStatus } = req.body;
    
    if (!checkoutId || !paymentStatus) {
        return res.status(400).json(new API_response(400, [], "All fields are required"));
    }

    const checkout = await Checkout.findByIdAndUpdate(
        checkoutId,
        { paymentStatus },
        { new: true }
    );

    if (!checkout) {
        return res.status(404).json(new API_response(404, [], "Checkout not found"));
    }

    return res.status(200).json(new API_response(200, checkout, "Checkout status updated successfully"));
});

export { CreateCheckout, GetCheckout, UpdateCheckoutStatus };
