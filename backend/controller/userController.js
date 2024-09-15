import { ErrorHandler } from "../utils/errorHandler.js";
import User from "../models/user.model.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


const Register = async(req, res, next) => {
    try {
        const {name, email, password, avatar} = req.body;
        console.log(name, email, password);
        console.log(avatar);

        const user = await User.create({
            name, 
            email,
            password,
            avatar
        });
        console.log("User created", user);
        sendToken(user, 200, res);

    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
};

// Login User

const LoginUser = async(req, res, next) => {
    try {
        const {email, password} = req.body;
        // Check if user has given password and email
        if(!email || !password) {
            return res.status(400).json({
                message:"Email and Password not found",
            })
        }

        // check if user already exists
        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(401).json({
                message:"User does not exist",
            })
        }
        const isMatch = await user.comparePassword(password)
        

        if(!isMatch){
            return res.status(401).json({
                success: false,
                message:"Invalid email or password"
            })
        }

       sendToken(user, 200, res);
       
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}


const Logout = async(req, res, next) => {
    try {
        res.cookie("token", null,{
            expires:new Date(Date.now()),
            httpOnly:true
        });
        res.status(200).json({
            message:"User logged out"
        })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}


// forgotPassword
const forgotPassword = async(req, res, next) => {
    
        const user = await User.findOne({ email:req.body.email});
        if(!user){
            return next(new ErrorHandler("User not found", 404));
        }         
        // get reset password token
        const resetToken =  await user.getResetToken();
        
        console.log("protocol", req.protocal);
        await user.save({validateBeforeSave: false});

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
        const message = `your password reset token is:- \n ${resetPasswordUrl} \n\nIf you have not requested this emailthen, please ignore it`;
    try {
        await sendEmail({
            email:user.email,
            subject:`mern-ecommerse password recovery`,
            message
        });
        res.status(200).json({
            message:` Email sent to ${user.email} Successfully` 
        });

    } catch (error) {
       user.resetPasswordToken = "undefined";
       user.resetPasswordExpire = "undefined";

       await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500))
    }
};

// reset password
const resetPassword = async (req, res, next)=>{
    try {
        const {token } = req.params;

        // creating token hash
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token)
                                    .toString("hex");
        
        // find user with the help of token
        const user = await User.findOne({resetPasswordToken, resetPasswordExpire:{$gt:Date.now()}})

        if(!user){
            return next(new ErrorHandler("Reset Password Token is Invalid or has been expired", 400));    
        }

        if(req.body.password !== req.body.confirmPassword){
            return next(new ErrorHandler("Password does not match", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendToken(user, 200, res);
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}

// get user details
const getUserDetails = async (req, res, next)=>{
    try {
        const user = await User.findById(req.user.id);
        // console.log("user", user);
        res.status(200).json({
            message:"User profile",
            user
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}

// update password
const updatePassword = async (req, res, next)=>{
    try {
        const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.comparePassword(req.body.oldPassword);

    if(!isMatch){
        return next(new ErrorHandler("Invalid password", 401))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password mismatch",400));
    }

    user.password = req.body.newPassword

    await user.save();

    sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({message: error.message})   
    }
}

// update profile
const updateProfile = async (req, res, next)=>{
    
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            avatar: req.body.avatar,
        }
        
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {new: true});
        // console.log("updated user", user);

        res.status(200).json({
            message:"Profile updated successfully",
            user,
        })

    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
}

// get all users(admin)

const getAllUser = async (req, res, next)=>{
    try {
        const user = await User.find({});
        res.status(200).json({
            message:"All Users",
            user
        })
    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
}


// get single user(admin)

const getSingleUser = async(req, res, next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400));
    }

    res.status(200).json({
        message:"Single User",
        user
    })
};

// admin can update the role of a user
// update profile admin
const updateUserProfile = async(req, res, next)=>{
    
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
        }

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {new: true, runValidators: true,
            useFindAndModify: false,});

        res.status(200).json({
            message:"Profile updated successfully",
            user,
        })

    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
}

// delete user admin

const deleteUser = async(req, res, next)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return next(new ErrorHandler(`User not exist with Id: ${req.params.id}`, 400))
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message:"User deleted successfully",
        })


    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
}

const getAllItemsFromCart = async(req, res, next)=>{
    try {
        const user = await User.findById(req.user._id);
        // console.log("user",user)
        const cart = user.cart;
        res.status(200).json({
            success:true,
            cart,
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}



const addToCart = async (req, res, next) => {
    try {
        const { product, quantity } = req.body;

        // Check if the product is already in the cart
        const user = await User.findById(req.user._id);

        const existingProduct = user.cart.find(item => item._id === product._id);

        if (existingProduct) {
            // Update quantity if the product is already in the cart
            existingProduct.quantity += quantity;
           
            await user.save();
        } else {
            // Add a new item to the cart
            user.cart.push({ ...product, quantity });
            await user.save();
        }


        res.status(200).json({
            success: true,
            cart: user.cart
        });
    } catch (error) {
        // Handle errors during the cart update process
        console.error("Error in addToCart:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateItemFromCart = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        // console.log("quantity", quantity);
        // console.log(req.params.id);
        const user = await User.findOneAndUpdate(
            {
                _id: req.user._id,
                'cart._id': req.params.id,
            },
            { $inc: { 'cart.$.quantity': quantity } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User or product not found' });
        }

        // console.log("updated Quantity", user.cart);

        res.status(200).json({
            success: true,
            cart: user.cart,
        });
    } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteItemFromCart = async(req, res, next)=>{
    try {
       
        const user = await User.findById(req.user._id);
        const products = user.cart.filter(item => item._id !== req.params.id)
        // console.log("filtered products", products);
        user.cart = products;
        await user.save();
        res.status(200).json({success:true, cart:user.cart});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}




export {Register, 
    LoginUser, 
    Logout, 
    forgotPassword, 
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUser,
    getSingleUser,
    updateUserProfile,
    deleteUser,
    addToCart,
    getAllItemsFromCart,
    deleteItemFromCart,
    updateItemFromCart

};
