import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { upload } from './Middlewares/Multer.middleware.js'

const app = express()

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


// routes decleration
app.use("/api/v1/user", upload.none(),user)
app.use("/api/v1/product", product)


export { app }