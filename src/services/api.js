import axios from 'axios';

// Configure axios defaults
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '' : (process.env.REACT_APP_API_URL || 'http://localhost:8000'),
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.message);
    console.error('Full error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }
    
    if (error.response?.status === 405) {
      throw new Error('CORS error: Your backend needs to allow OPTIONS requests. Check CORS configuration.');
    }
    
    if (error.response?.status === 500) {
      throw new Error('Server error - check your backend logs for details');
    }
    
    if (error.response?.status === 404) {
      throw new Error('API endpoint not found - verify backend is running');
    }
    
    if (!error.response) {
      throw new Error('Cannot connect to backend. Make sure it\'s running on http://localhost:8000');
    }
    
    throw error;
  }
);

/**
 * Ask a mathematical question
 * @param {string|null} convId - Conversation ID (null for new conversation)
 * @param {string} query - The question to ask
 * @returns {Promise<Array>} Response array with conversation data
 */
export const askQuestion = async (convId, query) => {
  try {
    const response = await api.post('/ask', {
      conv_id: convId,
      query: query.trim()
    });
    
    return response.data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw new Error(error.message || 'Failed to get answer');
  }
};

/**
 * Submit feedback for an answer
 * @param {string} uniqueId - Unique ID of the answer
 * @param {string} value - Feedback value (correct, unclear, etc.)
 * @param {string|null} description - Optional feedback description
 * @returns {Promise<Object>} Response object with status
 */
export const submitFeedback = async (uniqueId, value, description = null) => {
  try {
    const response = await api.post('/feedback', {
      unique_id: uniqueId,
      value: value,
      description: description
    });
    
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error(error.message || 'Failed to submit feedback');
  }
};

/**
 * Get conversation history (for future use)
 * @param {string} convId - Conversation ID
 * @returns {Promise<Object>} Conversation data
 */
export const getConversation = async (convId) => {
  try {
    const response = await api.get(`/conversation/${convId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw new Error(error.message || 'Failed to load conversation');
  }
};

export default api;