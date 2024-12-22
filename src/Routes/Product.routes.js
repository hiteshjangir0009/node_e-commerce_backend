import { Router } from "express";
import { VerifyJWT } from "../Middlewares/Auth.middleware.js";
import {  User_login, User_register } from "../Controllers/User.controller.js";
import { Add_cart, Add_product, Get_cart_items, Get_product, Reduce_cart_quantity, Remove_cart_item } from "../Controllers/Product.controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";
// import { User_login, User_logout, User_refressToken, User_register } from "../Controllers/User.controller.js";


const router = Router()



// register 
router.route('/add').post( upload.fields([
    {
        name: "product_img",
        maxCount: 1
    }, 
]),VerifyJWT,Add_product)
router.route('/get').get(VerifyJWT,Get_product)
router.route('/cart').get(upload.none(),VerifyJWT,Get_cart_items)
router.route('/addCart').post(upload.none(),VerifyJWT,Add_cart)
router.route('/removeCart').post(upload.none(),VerifyJWT,Remove_cart_item)
router.route('/reduceqt').post(upload.none(),VerifyJWT,Reduce_cart_quantity)



export default router
