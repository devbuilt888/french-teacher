import OpenAI from 'openai';

let openai = null;

// Get environment variables with defaults
const getMaxTokens = () => {
  const envMaxTokens = process.env.REACT_APP_CHAT_MAX_TOKENS;
  return envMaxTokens ? parseInt(envMaxTokens, 10) : 150;
};

const getTemperature = () => {
  const envTemperature = process.env.REACT_APP_CHAT_TEMPERATURE;
  return envTemperature ? parseFloat(envTemperature) : 0.7;
};

// Initialize OpenAI client
export const initOpenAI = (apiKey) => {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
  });
  return openai;
};

// Get OpenAI client
export const getOpenAI = () => {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initOpenAI first.');
  }
  return openai;
};

// Send a message to ChatGPT and get a response
export const sendMessageToGPT = async (messages) => {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: getTemperature(),
      max_tokens: getMaxTokens(),
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};

// Create a system message for the French teacher
export const createFrenchTeacherSystemMessage = () => {
  return {
    role: "system",
    content: "You are a friendly French tutor called Super French Tutor. Your goal is to help the student practice conversational French. Keep your responses in simple French when possible, but offer translations or explanations in English when needed. Be encouraging and patient. Ask questions to keep the conversation going. Focus on practical, everyday French. If the student makes mistakes, gently correct them. Start with a friendly greeting in French."
  };
}; 