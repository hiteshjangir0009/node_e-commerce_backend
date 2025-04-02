import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { upload } from './Middlewares/Multer.middleware.js'
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express()


app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({ limit: '20kb' }))
app.use(express.static('public'))
app.use(cookieParser())


// Router import 
import user from '../src/Routes/User.routes.js'
import product from '../src/Routes/Product.routes.js'
import checkout from '../src/Routes/Checkout.routes.js'
import farmer from '../src/Routes/Farmer.routes.js'


// routes decleration
app.use("/api/v1/user", upload.none(),user)
app.use("/api/v1/product", product)
app.use("/api/v1/checkout",  upload.none(),checkout)
app.use("/api/v1/farmer",  upload.none(),farmer)


export { app }