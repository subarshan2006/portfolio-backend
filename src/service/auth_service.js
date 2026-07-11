import User from "../model/User.js";

export const register = async (data)=>{
    try{
        const user = new User(data);
        await user.save();
        return user;
    }catch(e){
        throw new Error(e);
    }
}

export const findByUserEmail = async (email)=>{
    try{
        const user = await User.findOne({email});
        if(!user){
            return {message:"User Not Found"}
        }
        return user;
    }catch(e){
        throw new Error(e);
    }
}