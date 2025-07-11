import express from 'express';
import { createResume, getResume, analyzeResume, matchJobs } from '../controllers/resume.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { uploadResume } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, uploadResume, createResume);

router.get('/:id', authMiddleware, getResume);

router.post('/:id/analyze', authMiddleware, analyzeResume);

router.post('/:id/match-jobs', authMiddleware, matchJobs);

export default router;
