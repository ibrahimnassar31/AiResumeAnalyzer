import express from 'express';
import { createJob, getJobs } from '../controllers/job.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createJob);

router.get('/', getJobs);

export default router;
