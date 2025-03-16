import { Router } from "express";
import { VerifyJWT } from "../Middlewares/Auth.middleware.js";
import { CreateCheckout, GetCheckout, UpdateCheckoutStatus } from "../Controllers/Checkout.controller.js";

const router = Router();

// Create checkout
router.route("/checkout").post(VerifyJWT, CreateCheckout);

// Get checkout details
router.route("/checkout").get(VerifyJWT, GetCheckout);

// Update checkout status
router.route("/checkout/status").patch(VerifyJWT, UpdateCheckoutStatus);

export default router;
