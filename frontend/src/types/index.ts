// Resume file metadata
export interface ResumeFile {
  name: string;
  size: number; // in bytes
  type: string; // MIME type
  url?: string; // for preview/download
}

// AI Model Option
export interface AIModelOption {
  id: string;
  label: string;
  description?: string;
}

// Resume Analysis Result
export interface AnalysisResult {
  score: number;
  atsScore: number;
  keywords: string[];
  suggestions: string[];
  matchedJobDescription?: boolean;
  contentImprovements?: string[];
  skills?: string[];
  atsTips?: string[];
  language?: string;
}

// User Review
export interface UserReview {
  id: string;
  name: string;
  avatarUrl: string;
  review: string;
  date: string;
}

// Pricing Plan
export interface PricingPlan {
  id: string;
  name: string;
  price: number | 'custom';
  features: string[];
  ctaLabel: string;
  highlight?: boolean;
}
