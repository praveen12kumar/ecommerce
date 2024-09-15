import app from "./app.js";
import { config } from 'dotenv';
import connectDB from "./config/db.js";
config({
    path:"backend/config/config.env",
})


// connect DB
connectDB();



app.listen(process.env.PORT, ()=>{
    console.log("server listening on port: ", process.env.PORT);
})