import {User} from '../models/user.model.js'
import {ApiError} from '../config/apiError.js'
import {asyncHandler } from '../config/asyncHandler.js'
import {ApiResponse} from '../config/apiResponse.js'
import { uploadOnCloudinary } from '../config/cloudinary.js'
import bcryptjs from 'bcryptjs'

export const generateAccessAndRefreshTokens = async(userid) => {
	try {
		const user = await User.findById(userid)
		  if (!user) {
				throw new ApiError(404, "User not found");
			}
		
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		user.refreshToken = refreshToken

		await user.save({validateBeforeSave: false})

		return {accessToken, refreshToken}
	} catch (error) {
		console.error("Error generating tokens:", error);
		throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
	}
}

export const userRegister = asyncHandler( async(req, res)  => {
	
	const{fullName, email, username,  password } = req.body

	if (
		[fullName, email, username, password].some((field) =>
		field?.trim() === "")
	){
		throw new ApiError(400, "All fields are required")
	}

	const existedUser = await User.findOne({
		$or :[{username}, {email}]
	})

	if(existedUser) {
		throw new ApiError(409, "User with email or username already exists")
	}

	const avatarLocalPath = req.file?.path;
	let avatarUrl = ""
	if(avatarLocalPath) {
		const avatar = await uploadOnCloudinary(avatarLocalPath)
		if(!avatar){
			throw new ApiError(400, 'Avatar file is required')
		}
		avatarUrl = avatar.url
	}else{
		avatarUrl = 'https://example.com/default-avatar.png';
	}

	const user = await User.create({
		avatar: avatarUrl,
		fullName,
		email,
		username,
		password
	})

	return res.status(201).json(
		new ApiResponse(200, user, "User register Successfully")
	)

});

export const userLogin = asyncHandler(async(req, res) => {	

	const {email, password} = req.body

	if (
		[email, password].some((field) =>
		field?.trim() === "")
	){
		throw new ApiError(400, "All fields are required")
	}

	const user = await User.findOne({email})
	

	if(!user){
		throw new ApiError(400, "User not found  ")
	}

	const isPasswordValid = await user.isPasswordCorrect(password)
	
	if(!isPasswordValid) {
		throw new ApiError(400, 'password does not match')
	}
	
	const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

	const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

	const options = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production'
	}

	return res
	.status(200)
	.cookie('accessToken', accessToken, options)
	.cookie('refreshToken', refreshToken, options)
	.json(
		new ApiResponse(
			200,
			{
				user: loggedInUser, accessToken, refreshToken
			},
			"User Logged in successfully!"
		)
	)

})

export const logoutUser  = asyncHandler(async(req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$unset:{
				refreshToken: 1,
			},
		},
		{
			new: true
		}
	)

	const options = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	};

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(
			new ApiResponse(
				200,
				{},
				"User logged Out"
			)
		)
})

export const changeCurrentPassword = asyncHandler (async(req, res)=> {
	const {oldPassword, newPassword, confirmPassword } = req.body
	
	if (!oldPassword) {
		throw new ApiError(400, "Old password are required");
	}
	if(!newPassword){
		throw new ApiError(400, "New password are required");
	}
	if(!confirmPassword){
		throw new ApiError(400, "confirm password are required");
	}

	if (newPassword.trim() !== confirmPassword.trim()) {
		throw new ApiError(404, "Passwords do not match");
	}

	if(newPassword?.trim() !== confirmPassword?.trim() ){
		throw new ApiError(404, "Passwords do not match")
	}

	const user  = await User.findById(req.user?._id)

	const isCorrectPassword = await user.isPasswordCorrect(oldPassword)

	if(!isCorrectPassword) {
		throw new ApiError(400, 'Invalid old Password')
	}	

	user.password = newPassword //set newPassword in user

	await user.save({validateBeforeSave: false}) ///save password

	return res
		.status(200)
		.json(new ApiResponse(
			200,
			{},
			"password changed successfully"
		))
})

export const currentUser = asyncHandler(async(req, res) =>{
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				req?.user,
				"Current data fetched successfully"
			)
		)
})

export const updateAccountDetails = asyncHandler(async(req, res) => {
	const data = JSON.parse(req.body.data)
	console.log(data);
	
	const { fullName, email, username, password } = data;

	const avatarLocalPath = req.file?.path;

	let user = await User.findById(req.user?._id)
	if(!user){
		throw new ApiError(400, "User not Found")
	}
	let avatarUrl = user?.avatar; 
	if(avatarLocalPath){
		const avatarUploded = await uploadOnCloudinary(avatarLocalPath);
		avatarUrl = avatarUploded.url;
	}
	
	if (password) {
        user.password = password;
    }

	user.fullName = fullName,
	user.email = email,
	user.username = username,
	user.avatar = avatarUrl

	await user.save();

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				user,
				"Account details updated successfully"
			)
		)

})

export const authWithGoogle = asyncHandler(async(req,res) => {
	const {fullName, email, avatar} = req.body

	console.log(req.body);
	
	const user = await User.findOne({email})
	if(!user){
		throw new ApiError(400, "User not found")
	}

	user.fullName = fullName
	user.avatar = avatar

	await user.save();


	const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

	const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

	const options = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production'
	}

	return res
	.status(200)
	.cookie('accessToken', accessToken, options)
	.cookie('refreshToken', refreshToken, options)
	.json(
		new ApiResponse(
			200,
			{
				user: loggedInUser, accessToken, refreshToken
			},
			"User Logged in successfully!"
		)
	)

	
	
})