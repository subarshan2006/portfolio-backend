import express from 'express';
import cors from 'cors';
import router from './src/router/auth_router.js'
import studentRouter from './src/router/student_router.js'
import mongoose from 'mongoose';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api',router);
app.use('/api',studentRouter);

const mongo = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/intern-project");
        console.log("Mongo Connected")
    }catch(e){
        console.log(e);
    }
}
mongo();

app.listen(3000,()=>{
    console.log("server is running on 3000");
});