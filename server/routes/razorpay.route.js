
import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { createOrder, verifyPayment } from '../controllers/razorpay.controller.js';
 

const router = express.Router();

router.post('/order',isAuth, createOrder);
router.post('/verify',isAuth, verifyPayment);

export default router;
