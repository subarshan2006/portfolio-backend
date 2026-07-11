import { registerUser,loginUser } from "../controller/auth_controller.js";
import express from 'express';

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);

export default router;