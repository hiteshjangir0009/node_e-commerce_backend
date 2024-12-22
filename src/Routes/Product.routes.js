import { Router } from "express";
import { VerifyJWT } from "../Middlewares/Auth.middleware.js";
import {  User_login, User_register } from "../Controllers/User.controller.js";
import { Add_cart, Add_product, Get_product, Reduce_cart_quantity, Remove_cart_item } from "../Controllers/Product.controller.js";
// import { User_login, User_logout, User_refressToken, User_register } from "../Controllers/User.controller.js";


const router = Router()



// register 
router.route('/add').post(VerifyJWT,Add_product)
router.route('/get').get(VerifyJWT,Get_product)
router.route('/addCart').post(VerifyJWT,Add_cart)
router.route('/removeCart').post(VerifyJWT,Remove_cart_item)
router.route('/reduceqt').post(VerifyJWT,Reduce_cart_quantity)



export default router
