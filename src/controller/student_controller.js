import {createStudent, getAllStudent ,getStudentById,UpdateStudent,deleteStudent  } from "../service/student_service.js";

export const createStudentController = async(req,res)=>{
    try{
        const {id,name,age,grade} = req.body;
        if(!id || !name || !age || !grade){
            return res.status(401).json({message:"Fill all the fields"});
        }
        await createStudent({id,name,age,grade});
        return res.status(201).json({message:"Student created successfully"});
    }catch(e){
        return res.status(500).json({message:e.message});
    }
}

export const getAllStudentController = async(req,res)=>{
    try{
        const student = await getAllStudent();
        return res.status(200).json(student);
    }catch(e){
        return res.status(500).json({message:e.message});
    }
}

export const getStudentByIdController = async(req,res)=>{
    try{
        const { id } = req.params;
        const student = await getStudentById(id);
        return res.status(200).json(student);
    }catch(e){
        return res.status(500).json({message:e.message});
    }
}

export const updateStudentController = async(req,res)=>{
    try{
        const { id } = req.params;
        const {name,age,grade} = req.body;
        if(!name || !age || !grade){
            return res.status(401).json({message:"Fill all the fields"});
        }
        const student = await UpdateStudent(id,{name,age,grade});
        return res.status(200).json(student);
    }catch(e){
        return res.status(500).json({message:e.message});
    }
}

export const deleteStudentController = async(req,res)=>{
    try{
        const { id } = req.params;
        const student = await deleteStudent(id);
        return res.status(200).json(student);
    }catch(e){
        return res.status(500).json({message:e.message});
    }
}
