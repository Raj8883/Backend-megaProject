import mongoose from 'mongoose';
import { uploadOncloudinary } from '../utils/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';

const registerUser = asyncHandler(async (req, res) => {
    // Logic for user registration
    // collect data  user from frontend
    // validation -not empty fields 
    // check if user already exists- usernmae or email
    // check images  and avatar
    // create user object - entry in db 
    // remove password and refreshtoken from response
    // check for user creation 
    // return response 

    const { fullname, email, username, password } = req.body;

    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, 'All fields are required');
    }

    const existedgUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedgUser) {
        throw new ApiError(409, 'User already exists with this username or email');
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar image is required');
    }

    const avatar = await uploadOncloudinary(avatarLocalPath);
    const coverImage = await uploadOncloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        password,
        email,
        avatar: avatar?.url||"",
        coverImage: coverImage?.url || null,
    });

    const createdUser = await User.findById(user._id).select('-password -refreshToken');
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    return res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully"));
});



export { registerUser, };

