import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
},{timestamps:true});

const User = mongoose.model("User",userScheme);

export default User;