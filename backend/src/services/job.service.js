import Job from '../models/job.model.js';
import logger from '../utils/logger.js';

export async function createJob(userId, jobData) {
  const job = new Job({ ...jobData, postedBy: userId });
  await job.save();
  logger.info('Job created', { userId, jobId: job._id });
  return {
    id: job._id,
    title: job.title,
    company: job.company,
    jobType: job.jobType,
    postedBy: job.postedBy,
  };
}

export async function getJobs() {
  const jobs = await Job.find().populate('postedBy', 'username email');
  logger.info('Jobs fetched', { count: jobs.length });
  return jobs;
}
