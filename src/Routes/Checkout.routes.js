import { Router } from "express";
import { VerifyJWT } from "../Middlewares/Auth.middleware.js";
import { CreateCheckout, GetAllCheckouts, GetCheckout, UpdateCheckoutStatus } from "../Controllers/Checkout.controller.js";

const router = Router();

// Create checkout
router.route("/checkout").post(VerifyJWT, CreateCheckout);

// Get checkout details
router.route("/getcheckout").get(VerifyJWT, GetCheckout);

// Update checkout status
router.route("/status").patch(VerifyJWT, UpdateCheckoutStatus);

router.route("/getcheckout").patch( GetAllCheckouts);


export default router;
