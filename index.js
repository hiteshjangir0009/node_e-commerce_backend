import 'dotenv/config';
import dotenv from 'dotenv'
import { app } from './src/App.js';
import ConnectDB from './src/DB/DB_connect.js';

dotenv.config({
    path: './env'
})

const port = process.env.PORT || 8000 || 3000

ConnectDB()
    .then(async () => {
        app.listen(port, () => {
            console.log(`Server is connected to ${port}`)
        })
    })
    .catch((err) => {
        console.error(`MongoDB connection failed !!!`, err);
        // console.log(`Server is connected to ${port}`)

        throw err
    })