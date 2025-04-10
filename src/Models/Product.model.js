import mongoose from "mongoose";

const Product_schema = mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    catagory: {
        type: String,
        required: true
    },
    product_img: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    quantity: {
        type: String,
    },
    ratings: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5
                },
                comment: {
                    type: String
                }
            }
        ],
        default: []
    }
});

export const Product = mongoose.model('Product', Product_schema);
