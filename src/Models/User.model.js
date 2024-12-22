import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


const User_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refress_token: {
        type: String,
    },
    cart: [
        {
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
    address:{
        type:String
    },
    pincode:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },

})

User_schema.pre('save', async function (next) {
    if (!this.isModified("password")) return next()
    this.password =await bcrypt.hash(this.password, 10)
    next()
})

// checking password is correct or not
User_schema.methods.isPasswordCorrect = async function (Password) {
    return await bcrypt.compare(Password, this.password)
}


// methods for jwt access tokens
User_schema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            designation:'sales',
            employ_id: this.employ_id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// methods for jwt refress tokens
User_schema.methods.generateRefressToken = function () {
    return jwt.sign(
        {
            designation:'sales',
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', User_schema)