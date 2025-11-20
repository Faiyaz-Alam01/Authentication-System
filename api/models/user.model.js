import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
	fullName: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	accaccessToken: {
		type: String
	},
	refreshToken: {
		type: String
	}
}, {timestamps: true})

//encrypt the password before save
userSchema.pre('save', async function(next) {
	if(!this.isModified("password")) return next()
	this.password = await bcrypt.hash(this.password, 10)
	next();
})

// password check 
userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
}

//create Access Token using bcrypt
userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			//sign token ke liye payload
			_id: this._id,
			email: this.email,
			fullName: this.fullName,
			username: this.username
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY
		}

	)
}

//refresh token create
userSchema.methods.generateRefreshToken = function () {

	return jwt.sign(
		{
			_id: this._id
		},
			process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn:process.env.REFRESH_TOKEN_EXPIRY
		}
	)
}

export const User = mongoose.model("User", userSchema)