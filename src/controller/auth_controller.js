import {register , findByUserEmail} from '../service/auth_service.js';

export const registerUser = async (req,res)=>{
    try{
        const {email,password,repassword}=req.body;
        if(!password || !email || !repassword){
            return res.status(401).json({message:"Fill all the feilds"})
        }
        if(password !== repassword){
            return res.status(401).json({message:"Invalid credientials"})
        }
        const user = await register({email,password});
        return res.status(200).json({message:"register successfuly"});
    }catch(e){
        return res.status(500).json({message:e.message})
    }
}

export const loginUser = async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!password || !email){
            return res.status(401).json({message:"Fill all the feilds"})
        }
        const user = await findByUserEmail(email);
        if(password !== user.password){
            return res.status(401).json({message:"Invalid credientials"})
        }
        return res.status(200).json({message:"login successfuly"});
    }catch(e){
        return res.status(500).json({message:e.message})
    }
}