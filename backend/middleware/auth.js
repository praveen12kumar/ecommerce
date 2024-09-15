import { ErrorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuthenticatedUser = async (req, res, next)=>{
    try {
        const {token} = req.cookies;
        
        if(!token){
            return next(new ErrorHandler("Please Login to access this resource.", 401));
        }

        const decodedData =  jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findById(decodedData.id);

        next();
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


const authorizeRoles = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){ // role-> user  
           return next( new ErrorHandler(`Role: ${req.user.role} is not allow to access this resource`, 403))
        };
        next();
    }
    
}


export {isAuthenticatedUser, authorizeRoles};