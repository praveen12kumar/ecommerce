import User from "../models/user.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {uploadFileToCloudinary} from "../utils/cloudinary.js";
import { response } from "express";

const registerUser = asyncHandler(async(req, res)=>{
    // get user details from frontend
    // validation -not empty
    // check if user is already registered (email)
    // check for images and avatar
    // upload them to cloudinary
    // check avatar upload on cloudinary
    // create user object 
    // remove the password and refresh token field from responose
    // check user creation
    // return res
    const {fullName, email, password} = req.body;
   
    if(!fullName || !email || !password){
        
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({email});
    
    if(existedUser){
        throw new ApiError(409, "User already exists");
    }
    console.log(req.file);
    const avatarLocalPath = req.file?.path;
    

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file required");
    }

    const avatar = await uploadFileToCloudinary(avatarLocalPath);
    
    if(!avatar){
        throw new ApiError(400, "Avatar file not uploaded");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar: avatar.url,
    })

    const createdUser = await User.findById(user._id).select("-password")

    if(!createdUser){
        throw new ApiError(500, "User not created")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )

})



export {registerUser};