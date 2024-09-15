import express from 'express';
import {createProduct, 
        getAllProducts, 
        updateProduct, 
        deleteProduct, 
        getProductDetails,
        createProductReview,
        getProductReviews,
        deleteReviews,
    
    } from '../controller/productController.js';
import {isAuthenticatedUser, authorizeRoles} from '../middleware/auth.js';



const productRouter = express.Router();


productRouter.route('/products').get( getAllProducts);

productRouter.post("/admin/newproduct", isAuthenticatedUser, authorizeRoles("admin"), createProduct);

productRouter.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
.get(getProductDetails)

productRouter.route("/product/:id").get(getProductDetails)

productRouter.route("/product/review").post(isAuthenticatedUser, createProductReview);

productRouter.route("/reviews").get(getProductReviews)
                               .delete(isAuthenticatedUser, deleteReviews);



export default productRouter;