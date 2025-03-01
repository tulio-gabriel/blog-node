import mongoose from "mongoose";
import { Schema } from "mongoose";

const Usuario= new Schema({
	nome:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	senha:{
		type:String,
		required:true
	},
	eAdmin:{
		type:Number,
		default: 0
	}
})

mongoose.model("usuarios",Usuario)
export default Usuario;