import { Router } from "express";
import { VerifyJWT } from "../Middlewares/Auth.middleware.js";
import {  Update_address, User_login, User_register } from "../Controllers/User.controller.js";
// import { User_login, User_logout, User_refressToken, User_register } from "../Controllers/User.controller.js";


const router = Router()



// register 
router.route('/register').post(User_register)

// login
router.route('/login').post(User_login)

// add address
router.route('/address').post(VerifyJWT,Update_address)



export default router
