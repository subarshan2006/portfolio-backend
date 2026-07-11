import mongoose from 'mongoose';

const employeeScheme = new mongoose.Schema({
    id:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    age:{
        type:Number,
        require:true
    },
    department:{
        type:String,
        require:true
    }
},{timestamps:true})

const Employee = mongoose.model("Employee",employeeScheme);

export default Employee;