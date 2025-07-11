import * as jobService from '../services/job.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.user._id, req.body);
  logger.info('Job created via controller', { userId: req.user._id, jobId: job.id });
  res.status(201).json({
    message: 'Job created successfully',
    job,
  });
});

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getJobs();
  logger.info('Jobs fetched via controller', { count: jobs.length });
  res.status(200).json({ jobs });
});
