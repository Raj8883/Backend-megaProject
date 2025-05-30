import mongoose,{Schema} from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },

    Avatar: {
        type:String,//cloudinary url
        trim:true,
    },

    coverImage: {
        type:String,//cloudinary url
    },
    watchHistory: {
        type:Schema.Types.ObjectId,
        ref:"video",
    },
    password: {
        type:String,
        required:[true, "Password is required"],
    },
    refreshToken: {
        type:String,
    },
},{timestamps:true});

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash("this.password",10);
    next();
})

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,   
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
     jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);