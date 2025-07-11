import { Router } from 'express';
import userRouter from './user.route.js';
import resumeRouter from './resume.route.js';  
import jobRouter from '../routes/job.route.js';
const router = Router();

router.use('/users', userRouter);
router.use('/resumes', resumeRouter);  
router.use('/jobs', jobRouter);

export default router;
