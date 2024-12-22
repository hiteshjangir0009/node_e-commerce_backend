import mongoose from "mongoose";
import { DB_name } from "../Constant.js";

const ConnectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_name}`)
        console.log(`\n Mongo connected || DB_Host: ${connection.connection.host}`)

    } catch (error) {
        console.error("FAILED in mongo connection == ", error)
        console.log(`Server is connected to ${process.env.PORT}`)

        process.exit(1)
    }
}
export default ConnectDB