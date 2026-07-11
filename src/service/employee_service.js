import Employee from "../model/Employee.js";

export const createEmployee = async (data)=>{
    try{
        const employee = new Employee(data);
        await employee.save();
        return {message:"Employee created successfully"};
    }catch(e){
        throw new Error(e);
    }
}

export const getAllEmployee = async ()=>{
    try{
        const employee = await Employee.find();
        return employee;
    }catch(e){
        throw new Error(e);
    }
}
export const getEmployeeById = async (id)=>{
    try{
        const employee = await Employee.findOne({id});
        return employee;
    }catch(e){
        throw new Error(e);
    }
}

export const UpdateEmployee = async (id,data)=>{
    try{
        const employee = await Employee.findByIdAndUpdate(id,data);
        if(!employee) return {message:"Employee Not Found"};
        return employee;
    }catch(e){
        throw new Error(e);
    }
}

export const deleteEmployee = async (id)=>{
    try{
        const employee = await Employee.findByIdAndDelete(id);
        if(!employee) return {message:"Employee Not Found"};
        return employee;
    }catch(e){
        throw new Error(e);
    }
}
