import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

//Mongoose
const connectDB= async ()=>{
  try{
	await mongoose.connect(process.env.MONGODB_CONNECT_URI)
	console.log("Database connected");
  } catch (error){
	console.log("Could not connect to mongo db " + error);
  }
}

export default connectDB;