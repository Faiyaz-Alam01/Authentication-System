import mongoose from "mongoose";
import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";

dotenv.config({
	path: './.env'
});

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
	origin: process.env.CORS_ORIGIN,
	credentials: true
}))

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
//route
import userRoute  from "./routes/user.route.js";
app.use('/api/user', userRoute)

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(`Mongo Db connected `))
.catch((err) => console.log(`MongoDb Connection Failed ${err}`))

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
	
})