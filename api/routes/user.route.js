import express from 'express';
import { registerUser } from '../controllers/user.controllers.js';
import {upload} from "../middlewares/multer.middleware.js"; 

const router = express.Router();


router.route("/register").post(upload.single("avatar"), registerUser);



export default router;