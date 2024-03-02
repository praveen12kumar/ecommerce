import express, { urlencoded } from 'express';
import cors from "cors";



const app = express();

// middlewares
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(express.static("public")) // to store the images, pdf files 


// import routes 
import userRouter from "./routes/user.route.js";

app.use("/api/v1/users", userRouter);



export default app;

