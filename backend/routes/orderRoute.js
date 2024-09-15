import express from 'express';
import {isAuthenticatedUser, authorizeRoles} from '../middleware/auth.js';

import {
    createNewOrder,
    getSingleOrder,
    getMyAllOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,


} from "../controller/orderController.js";


const orderRouter = express.Router();

orderRouter.route("/new").post(isAuthenticatedUser, createNewOrder);

orderRouter.route("/orders/me").get(isAuthenticatedUser, getMyAllOrder);

orderRouter.route("/orders/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder);

orderRouter.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

orderRouter.route("/admin/orders/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
                                      .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

                                      





export default orderRouter;
