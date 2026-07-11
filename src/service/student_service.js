import Student from "../model/Student.js";

export const createStudent = async (data)=>{
    try{
        const student = new Student(data);
        await student.save();
        return {message:"Student created successfully"};
    }catch(e){
        throw new Error(e);
    }
}

export const getAllStudent = async ()=>{
    try{
        const student = await Student.find();
        return student;
    }catch(e){
        throw new Error(e);
    }
}
export const getStudentById = async (id)=>{
    try{
        const student = await Student.findOne({id});
        return student;
    }catch(e){
        throw new Error(e);
    }
}

export const UpdateStudent = async (id,data)=>{
    try{
        const student = await Student.findByIdAndUpdate(id,data);
        if(!student) return {message:"Student Not Found"};
        return student;
    }catch(e){
        throw new Error(e);
    }
}

export const deleteStudent = async (id)=>{
    try{
        const student = await Student.findByIdAndDelete(id);
        if(!student) return {message:"Student Not Found"};
        return student;
    }catch(e){
        throw new Error(e);
    }
}
