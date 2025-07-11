import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    minlength: [2, 'Company name must be at least 2 characters long'],
    maxlength: [100, 'Company name cannot exceed 100 characters'],
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    minlength: [2, 'Position must be at least 2 characters long'],
    maxlength: [100, 'Position cannot exceed 100 characters'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    default: null,
    validate: {
      validator: function (value) {
        return !this.startDate || !value || value >= this.startDate;
      },
      message: 'End date must be after start date',
    },
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
});

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true,
    minlength: [2, 'Institution name must be at least 2 characters long'],
    maxlength: [100, 'Institution name cannot exceed 100 characters'],
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true,
    maxlength: [100, 'Degree cannot exceed 100 characters'],
  },
  fieldOfStudy: {
    type: String,
    trim: true,
    maxlength: [100, 'Field of study cannot exceed 100 characters'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    default: null,
    validate: {
      validator: function (value) {
        return !this.startDate || !value || value >= this.startDate;
      },
      message: 'End date must be after start date',
    },
  },
});

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User', 
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [3, 'Full name must be at least 3 characters long'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?\d{10,15}$/, 'Please enter a valid phone number'],
    },
    skills: [
      {
        type: String,
        trim: true,
        minlength: [2, 'Skill must be at least 2 characters long'],
        maxlength: [50, 'Skill cannot exceed 50 characters'],
      },
    ],
    experiences: [experienceSchema],
    education: [educationSchema],
    certifications: [
      {
        name: {
          type: String,
          required: [true, 'Certification name is required'],
          trim: true,
          maxlength: [100, 'Certification name cannot exceed 100 characters'],
        },
        issuer: {
          type: String,
          trim: true,
          maxlength: [100, 'Issuer name cannot exceed 100 characters'],
        },
        issueDate: { type: Date },
      },
    ],
    rawText: {
      type: String,
      maxlength: [10000, 'Raw text cannot exceed 10000 characters'],
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'analyzed', 'rejected'],
      default: 'draft',
    },
    metadata: {
      fileType: {
        type: String,
        enum: ['pdf', 'doc', 'docx', 'txt'],
        default: 'pdf',
      },
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
    analysis: {
      score: {
        type: Number,
        min: [0, 'Score cannot be negative'],
        max: [100, 'Score cannot exceed 100'],
      },
      strengths: [{ type: String, trim: true }],
      weaknesses: [{ type: String, trim: true }],
      suggestions: [{ type: String, trim: true }],
      nlp: {
        entities: [mongoose.Schema.Types.Mixed],
        intent: String,
        sentiment: mongoose.Schema.Types.Mixed
      }
    },
    resumeFile: {
      type: String, 
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ userId: 1, status: 1 });
resumeSchema.index({ email: 1 });
resumeSchema.index({ skills: 1 });

export default mongoose.model('Resume', resumeSchema);