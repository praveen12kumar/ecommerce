import { ErrorHandler } from "../utils/errorHandler.js";

const errorMiddleware = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if(err.type === "CastError"){
        const message = `Resource not found. Invalid:${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        message:err.message
    })
};

export {errorMiddleware};