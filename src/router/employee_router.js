import { createEmployeeController, deleteEmployeeController, getAllEmployeeController, getEmployeeByIdController, updateEmployeeController } from "../controller/employee_controller.js";
import express from 'express';

const router = express.Router();

router.post('/add',createEmployeeController);
router.get('/',getAllEmployeeController);
router.get('/:id',getEmployeeByIdController);
router.put('/:id',updateEmployeeController);
router.delete('/:id',deleteEmployeeController);

export default router;