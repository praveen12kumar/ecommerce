import app from "./app.js";
import { config } from "dotenv";
import connectDB from "./config/db.js";

config({
    path:"api/config/config.env"
})

connectDB().then(
    app.listen(process.env.PORT, ()=>{
        console.log("server listening on port", process.env.PORT);
    })
)
.catch((err) =>{
    console.log(`mongodb server error: ${err}`);
})









