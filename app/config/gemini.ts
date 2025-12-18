// Google Gemini API Configuration
// DO NOT commit this file with real keys in production

export const GEMINI_CONFIG = {
  API_KEY: 'AIzaSyBIQ04Uls4vYuryY_mX6SOpzh_9TaCIxs0',
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  MAX_RESPONSE_LENGTH: 150, // words
  TIMEOUT: 30000, // 30 seconds
};

// System prompts based on role
export const SYSTEM_PROMPTS = {
  BASE: `You are ConnectO's AI assistant. Be concise, practical, and friendly.
Do not give legal, medical, or financial advice.
Focus only on marketplace-related help.
Keep responses under 150 words.
Never share personal data, phone numbers, or payment details.`,

  CUSTOMER: `You are a helpful assistant for customers looking to hire skilled workers in India.
Help them with:
- Finding the right type of worker
- Understanding pricing and rates
- Writing clear job descriptions
- Choosing categories
- Understanding reviews and ratings
- General marketplace navigation

Be practical and focus on ConnectO marketplace features.`,

  WORKER: `You are a helpful assistant for workers offering services on ConnectO in India.
Help them with:
- Getting more job opportunities
- Profile improvement tips
- Pricing their services competitively
- Job selection advice
- Work planning and scheduling
- Building better client relationships

Be encouraging and focus on earning more through quality service.`,
};

// Quick prompt suggestions
export const QUICK_PROMPTS = {
  CUSTOMER: [
    'Find a plumber near me',
    'How much does AC repair cost?',
    'Help me post a job',
    'How to choose a good worker?',
  ],
  WORKER: [
    'How can I get more jobs?',
    'Why am I not getting requests?',
    'How to improve my profile?',
    'What should I charge for my work?',
  ],
};
