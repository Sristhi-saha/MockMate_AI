import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import interviewRouter from './routes/interview.route.js';
import paymentRouter from './routes/razorpay.route.js'
const app = express();
// console.log(`app.js: ${process.env.CLIENT_URL}`);
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

console.log(process.env.CLIENT_URL)

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/payment', paymentRouter);
export default app;