import { createStudentController, deleteStudentController, getAllStudentController, getStudentByIdController, updateStudentController } from "../controller/student_controller.js";
import express from 'express';

const router = express.Router();

router.post('/add',createStudentController);
router.get('/',getAllStudentController);
router.get('/:id',getStudentByIdController);
router.put('/:id',updateStudentController);
router.delete('/:id',deleteStudentController);

export default router;
