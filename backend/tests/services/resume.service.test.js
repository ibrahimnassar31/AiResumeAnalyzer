import { jest } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../../src/models/user.model.js';
import Resume from '../../src/models/resume.model.js';
import Job from '../../src/models/job.model.js';

jest.unstable_mockModule('../../src/services/ai.service.js', () => ({
  analyzeResumeWithAI: jest.fn(),
}));

const { analyzeResumeWithAI } = await import('../../src/services/ai.service.js');
const resumeService = await import('../../src/services/resume.service.js');

describe('Resume Service', () => {
  let mongoServer;
  let user;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Resume.deleteMany({});
    await Job.deleteMany({});
    jest.clearAllMocks();
  });

  describe('createResume', () => {
    it('should create a new resume and analyze it with AI', async () => {
      const resumeData = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        rawText: 'Experienced software engineer with skills in JavaScript and Node.js.',
      };
      const aiAnalysis = {
        skills: ['JavaScript', 'Node.js'],
        experience: ['software engineer'],
        education: [],
        strengths: ['good experience'],
        weaknesses: [],
        suggestions: [],
      };
      analyzeResumeWithAI.mockResolvedValue(aiAnalysis);

      const resume = await resumeService.createResume(user._id, resumeData, null);

      expect(resume).toBeDefined();
      expect(resume.fullName).toBe('John Doe');
      expect(resume.analysis).toEqual(aiAnalysis);
      expect(aiService.analyzeResumeWithAI).toHaveBeenCalledWith(resumeData.rawText);

      const dbResume = await Resume.findById(resume.id);
      expect(dbResume).toBeDefined();
      expect(dbResume.analysis).toEqual(aiAnalysis);
    });
  });

  describe('analyzeResume', () => {
    it('should re-analyze a resume and update it', async () => {
      let resume = await Resume.create({
        userId: user._id,
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        rawText: 'Product manager with experience in agile methodologies.',
      });

      const aiAnalysis = {
        skills: ['agile methodologies'],
        experience: ['product manager'],
        education: [],
        strengths: [],
        weaknesses: [],
        suggestions: [],
      };
      analyzeResumeWithAI.mockResolvedValue(aiAnalysis);

      const analysis = await resumeService.analyzeResume(resume._id, user._id);

      expect(analysis).toEqual(aiAnalysis);
      expect(aiService.analyzeResumeWithAI).toHaveBeenCalledWith(resume.rawText);

      const dbResume = await Resume.findById(resume._id);
      expect(dbResume.status).toBe('analyzed');
      expect(dbResume.analysis).toEqual(aiAnalysis);
    });
  });

  describe('matchJobs', () => {
    it('should match jobs based on resume skills', async () => {
      const resume = await Resume.create({
        userId: user._id,
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        rawText: '...',
        analysis: {
          skills: ['JavaScript', 'React'],
        },
      });

      await Job.create([
        { title: 'Frontend Developer', company: 'Tech Corp', description: '...', requiredSkills: ['JavaScript', 'React'], experienceYears: 2, postedBy: user._id },
        { title: 'Backend Developer', company: 'Tech Corp', description: '...', requiredSkills: ['Node.js'], experienceYears: 2, postedBy: user._id },
        { title: 'Fullstack Developer', company: 'Tech Corp', description: '...', requiredSkills: ['JavaScript', 'Node.js', 'React'], experienceYears: 2, postedBy: user._id },
      ]);

      const matchedJobs = await resumeService.matchJobs(resume._id, user._id);

      expect(matchedJobs).toHaveLength(2);
      expect(matchedJobs[0].title).toBe('Frontend Developer');
      expect(matchedJobs[1].title).toBe('Fullstack Developer');
    });
  });
});
