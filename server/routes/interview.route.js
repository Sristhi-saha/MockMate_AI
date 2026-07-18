
import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import multer from '../middlewares/multer.middleware.js';
import { 
    analyseResume, 
    submitAnswer,
    generateQuestions, 
    finishInterview, 
    getMyInterviews, 
    getInterviewReport
} from '../controllers/interview.controller.js';


const router = express.Router();

// router.post('/resume-analyze',verifyToken,multer.single('resume'),analyseResume);
router.post('/resume-analyze',multer.single('resume'),analyseResume);
router.post('/submit-answer', isAuth,submitAnswer);
router.post('/generate-questions', isAuth, generateQuestions);
router.post('/finalize', isAuth, finishInterview);
router.get('/get-interview',isAuth, getMyInterviews);
router.get('/report/:id',isAuth,getInterviewReport);
router.get('/report',isAuth,getInterviewReport);


export default router;
