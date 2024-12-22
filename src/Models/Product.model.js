import mongoose from "mongoose"


const Product_schema = mongoose.Schema({
    product_name: {
        type: String,
        required: true
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
    
})


export const Product = mongoose.model('Product', Product_schema)