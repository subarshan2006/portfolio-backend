import {createEmployee, getAllEmployee ,getEmployeeById,UpdateEmployee,deleteEmployee  } from "../service/employee_service.js";

export const createEmployeeController = async(req,res)=>{
    try{
        const {id,name,age,department} = req.body;
        if(!id || !name || !age || !department){
            return res.status(401).json({message:"Fill all the fields"});
        }
        await createEmployee({id,name,age,department});
        return res.status(201).json({message:"Employee created successfully"});
    }catch(e){
        return res.status(500).json({message:e.message});
    }
}

export const getAllEmployeeController = async(req,res)=>{
    try{
        const employee = await getAllEmployee();
        return res.status(200).json(employee);
    }catch(e){
        return res.status(500).json({message:e.message});
    }
}

export const getEmployeeByIdController = async(req,res)=>{
    try{
        const { id } = req.params;
        const employee = await getEmployeeById(id);
        return res.status(200).json(employee);
    }catch(e){
        return res.status(500).json({message:e.message});
    }
}

export const updateEmployeeController = async(req,res)=>{
    try{
        const { id } = req.params;
        const {name,age,department} = req.body;
        if(!name || !age || !department){
            return res.status(401).json({message:"Fill all the fields"});
        }
        const employee = await UpdateEmployee(id,{name,age,department});
        return res.status(200).json(employee);
    }catch(e){
        return res.status(500).json({message:e.message});
    }
}

export const deleteEmployeeController = async(req,res)=>{
    try{
        const { id } = req.params;
        const employee = await deleteEmployee(id);
        return res.status(200).json(employee);
    }catch(e){
        return res.status(500).json({message:e.message});
    }
}  