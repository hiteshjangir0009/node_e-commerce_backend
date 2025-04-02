import { Checkout } from "../Models/Checkout.model.js";
import { API_response } from "../Utils/API_response.js";
import { Async_handler } from "../Utils/Async_handler.js";
import { User } from "../Models/User.model.js";


// Create Checkout
const CreateCheckout = Async_handler(async (req, res) => {
    let { cart, totalAmount, paymentStatus, shippingAddress } = req.body;

    console.log("Raw cart received:", cart);
    console.log("Type of cart:", typeof cart);
    
    // Ensure cart is an array
    if (!Array.isArray(cart)) {
        cart = [cart];  // Wrap object in an array if it's not already an array
    }

    if (!cart.length || !totalAmount || !shippingAddress) {
        return res.status(400).json(new API_response(400, [], "All fields are required"));
    }

    const checkout = await Checkout.create({
        user: req.user._id,
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


// Get All Checkout Orders (for Admin or Super Admin without JWT)
const GetAllCheckouts = Async_handler(async (req, res) => {

    const { role } = req.query; // This is a simple query parameter check
console.log('role ==>>',role);

    // Alternatively, you can use session or any other method for checking user roles

    if (role !== 'admin' && role !== 'superadmin') {
        return res.status(403).json(new API_response(403, [], "Access denied. You do not have permission."));
    }

    const checkouts = await Checkout.find(); // Fetch all checkout orders from the database

console.log("checkout ==>>",checkouts);


    if (!checkouts || checkouts.length === 0) {
        return res.status(404).json(new API_response(404, [], "No checkout orders found"));
    }

    return res.status(200).json(new API_response(200, checkouts, "All checkout orders fetched successfully"));
});


export { CreateCheckout, GetCheckout, UpdateCheckoutStatus, GetAllCheckouts };
