import express from 'express';
import {googleAuth, logOut} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/google',googleAuth);
router.get('/logout',logOut);

export default router;

// 2:07:10 --> auth ready need to test aftor databse connect succesfully