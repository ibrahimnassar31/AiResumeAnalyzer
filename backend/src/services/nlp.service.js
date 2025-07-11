import { NlpManager } from 'node-nlp';
import fs from 'fs/promises';
import path from 'path';

// إعداد NlpManager
const manager = new NlpManager({ languages: ['en'], forceNER: true });

// تدريب النموذج على بيانات عينة
const trainNlpModel = async () => {
  // أمثلة لتدريب استخراج الكيانات
  // Skills
  manager.addNamedEntityText('SKILL', 'JavaScript', ['en'], ['JavaScript', 'JS']);
  manager.addNamedEntityText('SKILL', 'Node.js', ['en'], ['Node.js', 'Node']);
  manager.addNamedEntityText('SKILL', 'Python', ['en'], ['Python', 'Py']);
  manager.addNamedEntityText('SKILL', 'React', ['en'], ['React', 'React.js']);
  manager.addNamedEntityText('SKILL', 'Angular', ['en'], ['Angular']);
  manager.addNamedEntityText('SKILL', 'Vue.js', ['en'], ['Vue.js', 'Vue']);
  manager.addNamedEntityText('SKILL', 'Java', ['en'], ['Java']);
  manager.addNamedEntityText('SKILL', 'C#', ['en'], ['C#', 'CSharp']);
  manager.addNamedEntityText('SKILL', 'Ruby', ['en'], ['Ruby']);
  manager.addNamedEntityText('SKILL', 'PHP', ['en'], ['PHP']);
  manager.addNamedEntityText('SKILL', 'SQL', ['en'], ['SQL']);
  manager.addNamedEntityText('SKILL', 'MongoDB', ['en'], ['MongoDB', 'Mongo']);
  manager.addNamedEntityText('SKILL', 'Docker', ['en'], ['Docker']);
  manager.addNamedEntityText('SKILL', 'Kubernetes', ['en'], ['Kubernetes', 'K8s']);
  manager.addNamedEntityText('SKILL', 'Git', ['en'], ['Git']);
  manager.addNamedEntityText('SKILL', 'HTML', ['en'], ['HTML', 'HTML5']);
  manager.addNamedEntityText('SKILL', 'CSS', ['en'], ['CSS', 'CSS3']);
  manager.addNamedEntityText('SKILL', 'TypeScript', ['en'], ['TypeScript', 'TS']);
  manager.addNamedEntityText('SKILL', 'Express.js', ['en'], ['Express.js', 'Express']);
  manager.addNamedEntityText('SKILL', 'Django', ['en'], ['Django']);
  manager.addNamedEntityText('SKILL', 'Flask', ['en'], ['Flask']);

  // Education
  manager.addNamedEntityText('EDUCATION', 'Bachelor', ['en'], ['Bachelor of Science', 'BSc', 'Bachelor']);
  manager.addNamedEntityText('EDUCATION', 'Master', ['en'], ['Master of Science', 'MSc', 'Master']);
  manager.addNamedEntityText('EDUCATION', 'PhD', ['en'], ['PhD', 'Doctor of Philosophy']);
  manager.addNamedEntityText('EDUCATION', 'High School', ['en'], ['High School Diploma']);
  manager.addNamedEntityText('EDUCATION', 'Associate Degree', ['en'], ['Associate Degree']);

  // Experience
  manager.addNamedEntityText('EXPERIENCE', 'Developer', ['en'], ['Software Developer', 'Developer']);
  manager.addNamedEntityText('EXPERIENCE', 'Engineer', ['en'], ['Software Engineer', 'Engineer']);
  manager.addNamedEntityText('EXPERIENCE', 'Data Scientist', ['en'], ['Data Scientist']);
  manager.addNamedEntityText('EXPERIENCE', 'Product Manager', ['en'], ['Product Manager', 'PM']);
  manager.addNamedEntityText('EXPERIENCE', 'DevOps Engineer', ['en'], ['DevOps Engineer']);
  manager.addNamedEntityText('EXPERIENCE', 'QA Engineer', ['en'], ['QA Engineer', 'Quality Assurance Engineer']);
  manager.addNamedEntityText('EXPERIENCE', 'UI/UX Designer', ['en'], ['UI/UX Designer', 'Designer']);

  // Certifications
  manager.addNamedEntityText('CERTIFICATION', 'AWS', ['en'], ['AWS Certified', 'Amazon Web Services']);
  manager.addNamedEntityText('CERTIFICATION', 'Google Cloud', ['en'], ['Google Cloud Certified', 'GCP']);
  manager.addNamedEntityText('CERTIFICATION', 'Azure', ['en'], ['Microsoft Certified: Azure', 'Azure Certified']);
  manager.addNamedEntityText('CERTIFICATION', 'PMP', ['en'], ['PMP', 'Project Management Professional']);
  manager.addNamedEntityText('CERTIFICATION', 'CISSP', ['en'], ['CISSP', 'Certified Information Systems Security Professional']);

  // أمثلة لتدريب تحديد النية
  manager.addDocument('en', 'Skills: JavaScript, Node.js, Python', 'skills_positive');
  manager.addDocument('en', 'Proficient in React, Angular, and Vue.js', 'skills_positive');
  manager.addDocument('en', 'Experience with SQL and MongoDB databases', 'skills_positive');
  manager.addDocument('en', 'Familiar with Docker and Kubernetes for deployment', 'skills_positive');
  manager.addDocument('en', 'Education: Bachelor of Science in Computer Science', 'education_positive');
  manager.addDocument('en', 'Holds a Master of Science and a PhD', 'education_positive');
  manager.addDocument('en', 'Experience: Software Developer at Tech Corp', 'experience_positive');
  manager.addDocument('en', 'Worked as a Data Scientist and later as a Product Manager', 'experience_positive');
  manager.addDocument('en', 'Certified with AWS and PMP', 'certification_positive');
  manager.addDocument('en', 'No relevant skills listed', 'skills_negative');
  manager.addDocument('en', 'Incomplete education details', 'education_negative');
  manager.addDocument('en', 'Lacks professional certifications', 'certification_negative');

  manager.addAnswer('en', 'skills_positive', 'Strong technical skills detected');
  manager.addAnswer('en', 'education_positive', 'Solid educational background');
  manager.addAnswer('en', 'experience_positive', 'Relevant work experience');
  manager.addAnswer('en', 'certification_positive', 'Valuable certifications found');
  manager.addAnswer('en', 'skills_negative', 'Missing relevant skills');
  manager.addAnswer('en', 'education_negative', 'Incomplete education details');
  manager.addAnswer('en', 'certification_negative', 'No certifications listed');

  await manager.train();
  await manager.save(path.join(process.cwd(), 'src/models/nlp_model.json'));
  console.log('NLP model trained and saved');
};

export const initializeNlp = async () => {
  try {
    const modelPath = path.join(process.cwd(), 'src/models/nlp_model.json');
    await fs.access(modelPath);
    await manager.load(modelPath);
    console.log('NLP model loaded successfully');
  } catch (error) {
    console.log('NLP model not found, training a new one...');
    await trainNlpModel();
  }
};

export const processResumeText = async (text) => {
  const response = await manager.process('en', text);
  return {
    entities: response.entities || [],
    intent: response.intent || 'none',
    sentiment: response.sentiment || { score: 0 },
  };
};