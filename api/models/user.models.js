import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({

    fullName:{
        type:String,
        required:true,
        maxLength:[30, "Name can not exceed 30 characters"],
        minLength:[5, "Name must be at least 5 characters"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://i.ibb.co/9YMtbtc/user.jpg",
    },
    role:{
        type:String,
        default:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

},{
    timestamps: true,
});


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function(incomingPassword){
    return await bcrypt.compare(incomingPassword, this.password)
};

userSchema.methods.generateJWTToken = async function(){
    return jwt.sign({
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
    },
        process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES
        }
    )
}



const User = mongoose.model("User", userSchema);

export default User;