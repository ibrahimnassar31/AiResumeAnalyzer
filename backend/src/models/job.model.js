import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [3, 'Job title must be at least 3 characters long'],
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters long'],
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    requiredSkills: [
      {
        type: String,
        required: [true, 'At least one skill is required'],
        trim: true,
        minlength: [2, 'Skill must be at least 2 characters long'],
        maxlength: [50, 'Skill cannot exceed 50 characters'],
      },
    ],
    experienceYears: {
      type: Number,
      required: [true, 'Experience years is required'],
      min: [0, 'Experience years cannot be negative'],
    },
    educationLevel: {
      type: String,
      enum: ['High School', 'Bachelor', 'Master', 'PhD', 'Other'],
      default: 'Bachelor',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'contract', 'internship'],
      default: 'full-time',
    },
    applicationDeadline: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= new Date();
        },
        message: 'Application deadline must be in the future',
      },
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Posted by is required'],
      ref: 'User', 
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ postedBy: 1, jobType: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ title: 1 });

export default mongoose.model('Job', jobSchema);