import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter you name"],
        maxLength:[30, "Name can not exceed 30 characters"],
        minLength:[5, "Name must be at least 5 characters"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Please Enter your email address"],
        validate:[validator.isEmail, "Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter your password"],
        minLength:[8, "Password must be at least 8 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            default:"this is public id",
            required:true
        },
        url:{
            type:String, 
            default:"https://i.ibb.co/94rD7x4/profile.jpg",
            required:true,
        }
    },
    role:{
        type:String,
        default:"user",
    },
    cart:[],
    
    createdAt:{
        type:Date,
        default:Date.now(),
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,

});


userSchema.pre("save", async function (next){

    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})


// genearte JWT token 
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES
    } )
}


// compare Password

userSchema.methods.comparePassword = async function(enteredPassword){
    return await  bcrypt.compare(enteredPassword, this.password);
}

// generating reset Password token

userSchema.methods.getResetToken = function(){
    //geneate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    //hasing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken)
        .toString("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}





const User = mongoose.model("User", userSchema);

export default User;