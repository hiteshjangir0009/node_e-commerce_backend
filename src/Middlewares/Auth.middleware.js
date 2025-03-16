import { User } from "../Models/User.model.js";
import { API_error } from "../Utils/API_error.js";
import { API_response } from "../Utils/API_response.js";
import jwt from "jsonwebtoken"
import { Async_handler } from "../Utils/Async_handler.js";


export const VerifyJWT = Async_handler(async (req, res, next) => {
    try {
        
        const token = req.header('Authorization')?.replace('Bearer ', "") || req.cookies?.Access_token;
        console.log("AccessToken ==>>", token)

        if (!token) {
            return res.status(400).json(
                new API_response(400, [], "token not found")
            )
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("decodeToken ==>>", decodeToken);

        let existed_user = {}


        existed_user = await User.findById(decodeToken._id).select(
            '-password -refress_token'
        )


        console.log("Token data ==>>", existed_user)

        if (!existed_user) {
            return res.status(400).json(
                new API_response(400, [], "invalid access token")
            )

        }
        req.user = existed_user
        console.log("verify jwt req ==>>" ,req.user);

        next()

    } catch (error) {
        return res.status(400).json(
            new API_response(400, [], "invalid access token")
        )
    }
})