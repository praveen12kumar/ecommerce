import express from 'express';
import { Register, 
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


} from '../controller/userController.js';
import {isAuthenticatedUser, authorizeRoles} from "../middleware/auth.js";


const userRouter = express.Router();


userRouter.post('/users/register', Register);

userRouter.post('/users/login', LoginUser);

userRouter.get('/users/logout', Logout);

userRouter.post("/password/forgot", forgotPassword);

userRouter.put("/resetPassword/:token", resetPassword);

userRouter.get('/me', isAuthenticatedUser, getUserDetails)

userRouter.route("/password/update").put(isAuthenticatedUser, updatePassword);

userRouter.route("/me/update").put(isAuthenticatedUser, updateProfile)

userRouter.route("/admin/user").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

userRouter.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
          .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserProfile)
          .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser )

userRouter.route("/cart/add").post(isAuthenticatedUser, addToCart);
userRouter.route("/cart").get(isAuthenticatedUser, getAllItemsFromCart);
userRouter.route("/cart/:id").delete(isAuthenticatedUser, deleteItemFromCart);
userRouter.route("/cart/:id").put(isAuthenticatedUser, updateItemFromCart);





export default userRouter;
