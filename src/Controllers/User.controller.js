import { User } from "../Models/User.model.js";
import { API_response } from "../Utils/API_response.js";
import { Async_handler } from "../Utils/Async_handler.js";
import jwt from 'jsonwebtoken'

const GenerateAccessRefressToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const Access_token = user.generateAccessToken()
        const Refress_token = user.generateRefressToken()

        user.refress_token = Refress_token
        await user.save({ validateBeforeSave: false })

        return { Access_token, Refress_token }
    } catch (error) {
        return res.status(400).json(
            new API_response(400, [], "something went wrong while generating token")
        )
    }
}

// register 
const User_register = Async_handler(async (req, res) => {

    const { name, email, password } = req.body

    // chack empty
    if ([name, password, email].some((element) => element?.trim() === "")) {
        return res.status(400).json(
            new API_response(400, [], "all fields are required")
        )
    }


    // check its already present or not
    const existed_user = await User.findOne({ email })

    if (existed_user) {
        return res.status(400).json(
            new API_response(400, [], "user already present")
        )
    }

    // create db
    const createDB = await User.create({
        email,
        name,
        password
    })

    // check DB
    const createedUser = await User.findById(createDB._id).select(
        " -refress_token"
    )

    return res.status(200).json(
        new API_response(201, createedUser, "register succesfully")
    )
})


// login
const User_login = Async_handler(async (req, res) => {

    const { email, password } = req.body

    // chack empty
    if (email == '' || password == "") {
        return res.status(400).json(
            new API_response(400, [], "all fields are required")
        )
    }

    // check its already present or not
    const existed_user = await User.findOne({ email })

    if (!existed_user) {
        return res.status(400).json(
            new API_response(400, [], "user not exist")
        )
    }


    // check password
    const isPasswordValid = await existed_user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res.status(400).json(
            new API_response(400, [], "invalid password")
        )
    }

    // generate token
    const { Access_token, Refress_token } = await GenerateAccessRefressToken(existed_user._id)

    // refress user as we generated tokens
    const LogedInUser = await User.findById(existed_user._id).select(
        "-password -refress_token"
    )

    // send cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("Access_token", Access_token, options)
        .cookie("Refress_token", Refress_token, options)
        .json(
            new API_response(
                201,
                {
                    LogedInUser,
                    Access_token,
                    Refress_token
                },
                "loged in succesfully"
            )
        )
})


// Update Address
const Update_address = Async_handler(async (req, res) => {
    const { address, pincode, city, state } = req.body;

    // Check for empty fields
    if ([address, pincode, city, state].some((field) => !field?.trim())) {
        return res.status(400).json(
            new API_response(400, [], "All fields (address, pincode, city, state) are required")
        );
    }

    // Update user's address information
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id, // Assuming req.user contains the authenticated user's ID
        {
            address,
            pincode,
            city,
            state,
        },
        { new: true } // Return the updated document
    ).select("-password -refress_token");

    // Check if user was updated successfully
    if (!updatedUser) {
        return res.status(404).json(
            new API_response(404, [], "User not found")
        );
    }

    return res.status(200).json(
        new API_response(200, updatedUser, "Address updated successfully")
    );
});




export { User_register, User_login,Update_address }