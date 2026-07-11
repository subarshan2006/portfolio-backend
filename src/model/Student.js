import mongoose from 'mongoose';

const studentScheme = new mongoose.Schema({
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
    grade:{
        type:String,
        require:true
    }
},{timestamps:true})

const Student = mongoose.model("Student",studentScheme);

export default Student;
