import mongoose from "mongoose";

const CheckoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cart: [
        {
            product_img: {
                type: String,
            },
            product_name: {
                type: String,
            },
            price: {
                type: Number,
            },
            quantity: {
                type: Number,
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    },
    shippingAddress: {
        address: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Checkout = mongoose.model("Checkout", CheckoutSchema);
