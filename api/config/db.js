import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
import colors from "colors";


const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`.underline.cyan);

    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`); 
        process.exit(1);
    }
}


export default connectDB;