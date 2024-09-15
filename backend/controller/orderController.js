import Order from "../models/order.model.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import Product from "../models/product.model.js"; 



const createNewOrder = async(req, res, next) =>{
    console.log("createNewOrder");
    try {
        const{shippingInfo, 
            orderItems, 
            paymentInfo, 
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt:Date.now(),
            user: req.user._id,
        })

        res.status(201).json({
            message:"Order created successfully",
            order
        })

    } catch (error) {
        res.status(500).json({
            message:error.message,
        })        
    }
}


// get Single order

const getSingleOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");

        if(!order){
        return next(new ErrorHandler("Order not found with this id: ", 404));
        }

        res.status(200).json({
        message:"Order",
        order
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
};

// get my Orders -- logged in user orders

const getMyAllOrder = async (req, res, next) => {
    try {
        
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({
        success: true,
        orders,
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}

// get all orders --Admin

const getAllOrders = async(req, res, next)=>{
    try {
        const orders = await Order.find();
        let totalAmount = 0;
        
        orders.forEach((order)=>(
            totalAmount += order.totalPrice
        ));

        res.status(200).json({
            totalAmount,
            orders,
        })

    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}



// update order status

const updateOrder =async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("Order have been already delivered", 400));
    }
  
    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
  };
  
  async function updateStock(id, quantity) {
    const product = await Product.findById(id);
  
    product.stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }
  
  // delete Order -- Admin
  const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
  
        if (!order) {
            return next(new ErrorHandler("Order not found with this Id", 404));
        }
  
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message:"Order deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
  }



export {
    createNewOrder,
    getSingleOrder,
    getMyAllOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
}


