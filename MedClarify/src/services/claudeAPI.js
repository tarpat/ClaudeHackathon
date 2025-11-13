import { TRANSLATION_SYSTEM_PROMPT, QA_SYSTEM_PROMPT_TEMPLATE } from '../utils/prompts';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;
const API_VERSION = '2023-06-01';

// API key should be set via environment variable
// For Expo, use: EXPO_PUBLIC_CLAUDE_API_KEY in .env file
const getApiKey = () => {
  const apiKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('Claude API key not configured. Please set EXPO_PUBLIC_CLAUDE_API_KEY in your environment.');
  }
  return apiKey;
};

/**
 * Makes a request to the Claude API with retry logic
 * @param {object} requestBody - The API request body
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<object>} API response
 */
const makeClaudeRequest = async (requestBody, retries = 2) => {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': getApiKey(),
        'anthropic-version': API_VERSION,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle rate limiting with retry
      if (response.status === 429 && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        return makeClaudeRequest(requestBody, retries - 1);
      }

      throw new Error(
        errorData.error?.message ||
        `Claude API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0 && error.message.includes('network')) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return makeClaudeRequest(requestBody, retries - 1);
    }
    throw error;
  }
};

/**
 * Translates medical document text to plain language using Claude API
 * @param {string} text - The medical document text
 * @returns {Promise<object>} Translated document data
 */
export const translateDocument = async (text) => {
  try {
    const requestBody = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: TRANSLATION_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
    };

    const response = await makeClaudeRequest(requestBody);

    // Extract the response text
    const responseText = response.content[0].text;

    // Parse JSON response
    const parsedData = JSON.parse(responseText);

    return {
      success: true,
      data: parsedData,
    };
  } catch (error) {
    console.error('Error translating document:', error);
    return {
      success: false,
      error: error.message || 'Failed to translate document',
    };
  }
};

/**
 * Translates medical document from image using Claude API
 * @param {string} base64Image - Base64 encoded image
 * @param {string} mediaType - Image media type (e.g., 'image/jpeg')
 * @returns {Promise<object>} Translated document data
 */
export const translateDocumentFromImage = async (base64Image, mediaType = 'image/jpeg') => {
  try {
    const requestBody = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: TRANSLATION_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: 'Please extract all text from this medical document and translate it to plain language following the JSON format specified.',
            },
          ],
        },
      ],
    };

    const response = await makeClaudeRequest(requestBody);

    // Extract the response text
    const responseText = response.content[0].text;

    // Parse JSON response
    const parsedData = JSON.parse(responseText);

    return {
      success: true,
      data: parsedData,
    };
  } catch (error) {
    console.error('Error translating document from image:', error);
    return {
      success: false,
      error: error.message || 'Failed to translate document from image',
    };
  }
};

/**
 * Asks a clarification question about the document using Claude API
 * @param {string} question - The user's question
 * @param {string} documentContext - The original document context
 * @param {array} conversationHistory - Previous Q&A exchanges
 * @returns {Promise<object>} Answer to the question
 */
export const askQuestion = async (question, documentContext, conversationHistory = []) => {
  try {
    // Format conversation history
    const historyText = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'Patient' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = QA_SYSTEM_PROMPT_TEMPLATE(documentContext, historyText);

    const requestBody = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
    };

    const response = await makeClaudeRequest(requestBody);

    // Extract the response text
    const answer = response.content[0].text;

    return {
      success: true,
      answer,
    };
  } catch (error) {
    console.error('Error asking question:', error);
    return {
      success: false,
      error: error.message || 'Failed to get answer',
    };
  }
};

/**
 * Tests the Claude API connection
 * @returns {Promise<boolean>} True if API is accessible
 */
export const testAPIConnection = async () => {
  try {
    const requestBody = {
      model: MODEL,
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hello',
        },
      ],
    };

    await makeClaudeRequest(requestBody);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};
