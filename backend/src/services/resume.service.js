import Resume from '../models/resume.model.js';
import Job from '../models/job.model.js';
import logger from '../utils/logger.js';
import { analyzeResumeWithAI } from './ai.service.js';

export async function createResume(userId, resumeData, file) {
  const resumeFile = file ? file.path : undefined;
  const text = resumeData.rawText || '';
  const analysis = text ? await analyzeResumeWithAI(text) : null;
  const resume = new Resume({ ...resumeData, userId, status: 'draft', resumeFile, analysis });
  await resume.save();
  logger.info('Resume created', { userId, resumeId: resume._id, resumeFile, analysis });
  return {
    id: resume._id,
    fullName: resume.fullName,
    email: resume.email,
    status: resume.status,
    resumeFile: resume.resumeFile,
    analysis: resume.analysis,
  };
}

export async function getResume(resumeId, userId) {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    logger.warn('Resume not found or access denied', { resumeId, userId });
    const error = new Error('Resume not found or access denied');
    error.statusCode = 404;
    throw error;
  }
  return resume;
}

export async function analyzeResume(resumeId, userId) {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    logger.warn('Resume not found or access denied', { resumeId, userId });
    const error = new Error('Resume not found or access denied');
    error.statusCode = 404;
    throw error;
  }
  const text = resume.rawText || '';
  const analysis = text ? await analyzeResumeWithAI(text) : null;
  resume.analysis = analysis;
  resume.status = 'analyzed';
  await resume.save();
  logger.info('Resume analyzed', { resumeId, userId });
  return analysis;
}

export async function matchJobs(resumeId, userId) {
  const resume = await getResume(resumeId, userId);

  if (!resume.analysis || !resume.analysis.skills) {
    logger.warn('Resume must be analyzed before matching jobs', { resumeId, userId });
    const error = new Error('Resume must be analyzed first');
    error.statusCode = 400;
    throw error;
  }

  const resumeSkills = resume.analysis.skills.map(skill => skill.toLowerCase());

  if (resumeSkills.length === 0) {
    logger.info('No skills found in resume for matching', { resumeId, userId });
    return [];
  }

  const jobs = await Job.find({
    requiredSkills: { $in: resumeSkills.map(skill => new RegExp(`^${skill}$`, 'i')) }
  }).populate('postedBy', 'username email').lean();

  const matchedJobs = jobs.map(job => {
    const jobSkills = job.requiredSkills || [];
    const matchedSkills = jobSkills.filter(skill =>
      resumeSkills.includes(skill.toLowerCase())
    );
    const score = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 100 : 0;
    return {
      jobId: job._id,
      title: job.title,
      description: job.description,
      matchScore: Math.round(score),
      matchedSkills,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  logger.info('Found matched jobs for resume', { resumeId, userId, count: matchedJobs.length });
  return matchedJobs;
}
