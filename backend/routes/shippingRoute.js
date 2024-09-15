import express from 'express';
import { isAuthenticatedUser } from '../middleware/auth.js';
import {addShippingAddress, deleteShippingAddress, getAllShippingAddress} from "../controller/shippingController.js";


const shippingRouter = express.Router();


shippingRouter.route('/shipping').post(isAuthenticatedUser, addShippingAddress);
shippingRouter.route('/shipping').get(isAuthenticatedUser, getAllShippingAddress)
shippingRouter.route('/shipping/:id').delete(isAuthenticatedUser, deleteShippingAddress)



export default shippingRouter;