/**
 * Service to access environment variables with fallbacks
 * 
 * This makes it easier to handle environment variables in both 
 * development and production environments
 */

// Get OpenAI API key from environment variables
export const getOpenAIApiKey = () => {
  return process.env.REACT_APP_OPENAI_API_KEY;
};

// Check if the API key is set in environment variables
export const hasOpenAIApiKey = () => {
  return !!getOpenAIApiKey();
}; 