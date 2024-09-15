import Shipping from "../models/shipping.model.js";


const addShippingAddress = async (req, res, next) => {
    const {shippingAddress} = req.body;
    console.log(shippingAddress);
    const {name, address, city, state, country, pinCode, phoneNo} = shippingAddress;
    //console.log(name, address, city, state, country, state, pinCode, phoneNo);
    try {
        
        const shippingAddress = await Shipping.create({
            name, 
            address,
            city,
            state,
            country,
            pinCode,
            phoneNo,
            user:req.user._id,
        });
        res.status(201).json({
            success: true,
            shippingAddress,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}



const deleteShippingAddress = async (req, res, next) => {
    try {
        const AddressOfUser = await Shipping.findById(req.params.id);

        if(!AddressOfUser){
            return next(new ErrorHandler("Address not found with this Id", 404));
        }

        await Shipping.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success:true,
            message:"Address Deleted Successfully",
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

const getAllShippingAddress = async (req, res, next) => {
    try {
        const shippingAddress = await Shipping.find().populate('user');
       
        res.status(200).json({
            success:true,
            shippingAddress
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

const updateAllShippingAddress = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}


export {addShippingAddress, deleteShippingAddress, getAllShippingAddress};