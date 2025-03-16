import { Query } from "mongoose";
import { Product } from "../Models/Product.model.js";
import { User } from "../Models/User.model.js";
import { API_response } from "../Utils/API_response.js";
import { Async_handler } from "../Utils/Async_handler.js";
import jwt from 'jsonwebtoken'
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";



// add product 
const Add_product = Async_handler(async (req, res) => {

    const { product_name,catagory, description, price,img } = req.body

    // chack empty
    if ([product_name, description, price,img,catagory].some((element) => element?.trim() === "")) {
        return res.status(400).json(
            new API_response(400, [], "all fields are required")
        )
    }


    // check its already present or not
    const existed_user = await Product.findOne({ product_name })

    if (existed_user) {
        return res.status(400).json(
            new API_response(400, [], "product already present")
        )
    }

    const product_img_path = req.files?.product_img[0]?.path;

    console.log("img_path ==>>",product_img_path);
    
    const avatar = await uploadOnCloudinary(product_img_path)

    if (!avatar) {
        return res.status(400).json(
            new API_response(400, [], "img not found")
        )
    }

    console.log("img ==>>",avatar.url);
    
    // create db
    const createDB = await Product.create({
        product_name,
        description,
        catagory,
        price,
        product_img:avatar.url
    })

    // check DB
    const addedProduct = await Product.findById(createDB._id)

    return res.status(200).json(
        new API_response(201, addedProduct, "product added sucessfully")
    )

})


// Add to Cart
const Add_cart = Async_handler(async (req, res) => {
    const { product_name, price, quantity } = req.body;

    // Check for empty fields
    if ([product_name, price, quantity].some((element) => element?.trim() === "")) {
        return res.status(400).json(
            new API_response(400, [], "All fields are required")
        );
    }

    console.log("Quantity received:", quantity);

    // Check if the product already exists in the user's cart
    const existingProductInCart = await User.findOne({
        _id: req.user._id,
        cart: { $elemMatch: { product_name } }, // Find matching product in cart
    });

    if (existingProductInCart) {
        // Update the quantity of the existing product in the cart
        const updatedUser = await User.findOneAndUpdate(
            {
                _id: req.user._id,
                "cart.product_name": product_name, // Match the specific product
            },
            {
                $inc: { "cart.$.quantity": quantity }, // Increment the quantity
            },
            { new: true } // Return the updated document
        ).select("-password -refresh_token");

        console.log("Cart updated with new quantity:", updatedUser);

        if (!updatedUser) {
            return res.status(500).json(
                new API_response(500, [], "Failed to update cart")
            );
        }

        return res.status(200).json(
            new API_response(200, updatedUser, "Cart updated successfully")
        );
    }

    // If product is not in the cart, add it as a new entry
    const newCartItem = { product_name, price, quantity };

    const updatedCart = await User.findByIdAndUpdate(
        req.user._id,
        {
            $push: { cart: newCartItem }, // Add new product to cart
        },
        { new: true } // Return the updated document
    ).select("-password -refresh_token");

    console.log("New product added to cart:", updatedCart);

    if (!updatedCart) {
        return res.status(500).json(
            new API_response(500, [], "Failed to add product to cart")
        );
    }

    return res.status(201).json(
        new API_response(201, updatedCart, "Product added to cart successfully")
    );
});


// Remove item from cart
const Remove_cart_item = Async_handler(async (req, res) => {
    const { product_name } = req.body;

    // Check if the product_name is provided
    if (!product_name || product_name.trim() === "") {
        return res.status(400).json(
            new API_response(400, [], "Product name is required")
        );
    }

    // Remove the product from the user's cart
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { cart: { product_name } }, // Remove item matching product_name
        },
        { new: true } // Return the updated document
    ).select("-password -refresh_token");

    // Check if the cart was updated
    if (!updatedUser) {
        return res.status(400).json(
            new API_response(400, [], "Unable to remove item from cart")
        );
    }

    return res.status(200).json(
        new API_response(200, updatedUser, "Item removed from cart successfully")
    );
});


// reduce quantuty
const Reduce_cart_quantity = Async_handler(async (req, res) => {
    const { product_name, quantity } = req.body;

    // Validate request
    if (!product_name || quantity === undefined || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json(
            new API_response(400, [], "Product name and valid quantity are required")
        );
    }

    // Check if the product exists in the user's cart
    const existingProductInCart = await User.findOne({
        _id: req.user._id,
        cart: { $elemMatch: { product_name } }, // Match the product in the cart
    });

    if (!existingProductInCart) {
        return res.status(404).json(
            new API_response(404, [], "Product not found in the cart")
        );
    }

    // Reduce the quantity of the product
    const updatedUser = await User.findOneAndUpdate(
        {
            _id: req.user._id,
            "cart.product_name": product_name, // Match the specific product
        },
        {
            $inc: { "cart.$.quantity": -quantity }, // Decrease the quantity
        },
        { new: true } // Return the updated document
    ).select("-password -refresh_token");

    // Remove the product from the cart if the quantity becomes 0 or less
    const updatedCart = await User.findOneAndUpdate(
        {
            _id: req.user._id,
        },
        {
            $pull: { cart: { product_name, quantity: { $lte: 0 } } }, // Remove item with quantity <= 0
        },
        { new: true }
    ).select("-password -refresh_token");

    if (!updatedUser && !updatedCart) {
        return res.status(500).json(
            new API_response(500, [], "Failed to update cart")
        );
    }

    return res.status(200).json(
        new API_response(200, updatedCart, "Quantity updated successfully")
    );
});


// get product
const Get_product = Async_handler(async (req, res) => {


    const data = await Product.find()

    if (data.length == 0) {
        return res.status(400).json(
            new API_response(400, [], "data is not available")
        )
    }

    return res.status(200).json(
        new API_response(
            201,

            data
            ,
            "data fetch successfully"
        )
    )

})

// Get All Items in Cart
const Get_cart_items = Async_handler(async (req, res) => {
    try {
        // Fetch the user's cart using their ID
        const user = await User.findById(req.user._id).select("cart -_id");

        // Check if the user exists and has a cart
        if (!user || !user.cart || user.cart.length === 0) {
            return res.status(404).json(
                new API_response(404, [], "No items in the cart")
            );
        }

        return res.status(200).json(
            new API_response(200, user.cart, "Cart items fetched successfully")
        );
    } catch (error) {
        return res.status(500).json(
            new API_response(500, [], "Failed to fetch cart items")
        );
    }
});


export { Add_product, Get_product, Add_cart,Remove_cart_item,Reduce_cart_quantity, Get_cart_items }