import mongoose from "mongoose";

const shippingSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    pinCode:{
        type:Number,
        required:true,
    },
    phoneNo:{
        type:Number,
        required:true,
    },
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"
    }
},{
    timestamps:true,
});

const Shipping = mongoose.model("Shipping", shippingSchema);

export default Shipping;
