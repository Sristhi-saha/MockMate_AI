
import express from 'express';
import verifyToken from '../middlewares/isAuth.js';
import { getCurrentUser } from '../controllers/user.controller.js';


const router = express.Router();

router.get('/current-user',verifyToken, getCurrentUser);

export default router;
