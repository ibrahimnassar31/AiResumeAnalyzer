import Joi from 'joi';

export const experienceSchema = Joi.object({
  company: Joi.string().min(2).max(100).required(),
  position: Joi.string().min(2).max(100).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().allow(null).min(Joi.ref('startDate')),
  description: Joi.string().max(500).allow('', null),
});

export const educationSchema = Joi.object({
  institution: Joi.string().min(2).max(100).required(),
  degree: Joi.string().max(100).required(),
  fieldOfStudy: Joi.string().max(100).allow('', null),
  startDate: Joi.date().required(),
  endDate: Joi.date().allow(null).min(Joi.ref('startDate')),
});

export const certificationSchema = Joi.object({
  name: Joi.string().max(100).required(),
  issuer: Joi.string().max(100).allow('', null),
  issueDate: Joi.date().allow(null),
});

export const createResumeSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?\d{10,15}$/).allow(null, ''),
  skills: Joi.array().items(Joi.string().min(2).max(50)).min(1),
  experiences: Joi.array().items(experienceSchema),
  education: Joi.array().items(educationSchema),
  certifications: Joi.array().items(certificationSchema),
  rawText: Joi.string().max(10000).allow('', null),
  status: Joi.string().valid('draft', 'submitted', 'analyzed', 'rejected').default('draft'),
  metadata: Joi.object({
    fileType: Joi.string().valid('pdf', 'doc', 'docx', 'txt').default('pdf'),
    uploadDate: Joi.date().default(() => new Date(), 'current date'),
  }).optional(),
});

export const updateResumeSchema = createResumeSchema.fork(['fullName', 'email'], (schema) => schema.optional());
