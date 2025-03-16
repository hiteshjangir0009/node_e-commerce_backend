import mongoose from "mongoose"


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
    
})


export const Product = mongoose.model('Product', Product_schema)