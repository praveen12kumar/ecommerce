
import Product from "../models/product.model.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";



// create Product -- Admin 
//@ url: "/apiv1/products/new"
//@ private
const createProduct = async (req, res) => {
    try {

        req.body.user = req.user.id;
        
        const product = await Product.create(req.body);
        res.status(201).json({
        message: "Product created successfully",
        product,
    })
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}

// get all products
//@url: "/api/v1/products
//public
const getAllProducts = async(req, res,)=>{
    
    try {
        const resultPerPage = 8;
        const productCount = await Product.countDocuments();
        const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
        
        const products = await apiFeature.query;
    
        res.status(200).json({
            message:"All products",
            products,
            productCount,
            resultPerPage,
        });

    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
};


// update Product -- Admin
//@url: "/apiv1/products/:id"
//@private

const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product not found", 404));
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body,
            {new:true,
            runValidators: true,
            useFindAndModify: true
            });

        res.status(200).json({
            message:"Product updated successfully",
            product
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product not found", 404));
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message:"Product deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}


const getProductDetails = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product not found", 404));
        }
    res.status(200).json({
        product,
    })
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}

const createProductReview = async (req, res, next) => {
    try {
        
        const {rating, comment, productId} = req.body;
        const review = {
            user:req.user._id,
            name:req.user.name,
            rating:Number(rating),
            comment,
        }

        // find Product
        const product = await Product.findById(productId);

        // check product is already reviewed

        const isReviewed = product.reviews.find((review)=> review.user.toString() === req.user.id.toString())
        
        if(isReviewed){
            product.reviews.forEach((review)=> {
                review.rating = rating;
                review.comment = comment;
            });
        }
        else{
            product.reviews.push(review);
            product.numberOfReviews = product.reviews.length
            
        }

        let avg = 0;    
        product.reviews.forEach((review)=> {
            avg += review.rating
        });

        product.ratings = avg / product.reviews.length;

        await product.save({validateBeforeSave: false});

        res.status(200).json({
            message:"Review added Successfully"
        })

    } catch (error) {
       res.status(500).json({
            message:error.message
       })
    }
};

// get all reviews of a product

const getProductReviews = async(req, res, next)=>{
    try {
        const product = await Product.findById(req.query.productId);

        if(!product){
            return next(new ErrorHandler("Product not found", 404))
        };

        res.status(200).json({
            reviews:product.reviews
        })

    } catch (error) {
        res.status(500).json({
            message:error.message
       })
    }
};


// Delete Revies of a product
const deleteReviews = async(req, res, next)=>{
    try {
        const product = await Product.findById(req.query.productId);
        // console.log("product", product);

        if(!product){
            return next(new ErrorHandler("Product not found", 404))
        };

        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== req.query.id.toString()
        );
       

        let avg = 0;    
        reviews.forEach((review)=> {
            avg += review.rating
        });
        let ratings = 0;

        if (reviews.length === 0) {
        ratings = 0;
        }      
        else {
        ratings = avg / reviews.length;
        }

        console.log("Ratings", ratings);

        const numberOfReviews = reviews.length
        
        await Product.findByIdAndUpdate(
            req.query.productId,
            {
              reviews,
              ratings,
              numberOfReviews,
            },
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );
        //console.log("Products", product);
        res.status(200).json({
            message: "Reviews deleted successfully"
        })

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}








export {createProduct,  
        getAllProducts, 
        updateProduct, 
        deleteProduct, 
        getProductDetails,
        createProductReview,
        getProductReviews,
        deleteReviews,
    }