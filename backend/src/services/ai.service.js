import OpenAI from 'openai';
import config from '../config/config.js';

let openai;

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }
  return openai;
}

export async function analyzeResumeWithAI(text) {
  if (!text) {
    return null;
  }

  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that analyzes resumes.
          Extract the following information from the resume text:
          - skills (as an array of strings)
          - experience (as an array of strings)
          - education (as an array of strings)
          - strengths (as an array of strings)
          - weaknesses (as an array of strings)
          - suggestions for improvement (as an array of strings)

          Return the response as a JSON object with the following keys: skills, experience, education, strengths, weaknesses, suggestions.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    return analysis;
  } catch (error) {
    console.error('Error analyzing resume with AI:', error);
    throw new Error('Failed to analyze resume with AI');
  }
}
