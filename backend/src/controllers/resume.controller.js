import * as resumeService from '../services/resume.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

export const createResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.createResume(req.user._id, req.body, req.file);
  logger.info('Resume created via controller', { userId: req.user._id, resumeId: resume.id, resumeFile: resume.resumeFile });
  res.status(201).json({
    message: 'Resume created successfully',
    resume,
  });
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getResume(req.params.id, req.user._id);
  logger.info('Resume fetched via controller', { userId: req.user._id, resumeId: req.params.id });
  res.status(200).json({ resume });
});

export const analyzeResume = asyncHandler(async (req, res) => {
  const analysis = await resumeService.analyzeResume(req.params.id, req.user._id);
  logger.info('Resume analyzed via controller', { userId: req.user._id, resumeId: req.params.id, nlp: analysis.nlp });
  res.status(200).json({
    message: 'Resume analyzed successfully',
    analysis,
  });
});

export const matchJobs = asyncHandler(async (req, res) => {
  const matchedJobs = await resumeService.matchJobs(req.params.id, req.user._id);
  logger.info('Jobs matched for resume via controller', { userId: req.user._id, resumeId: req.params.id, count: matchedJobs.length });
  res.status(200).json({
    message: 'Jobs matched successfully',
    matches: matchedJobs,
  });
});
