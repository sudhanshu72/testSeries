// API Service - connects to the serverless API functions
// When running locally: http://localhost:3000
// When deployed: same domain (Vercel serves both frontend + API)

const API_BASE = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '' // In production, API is on same domain
  : ''; // Also use same domain locally (Expo serves at same port)

export const api = {
  // Login
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: { message: data.error } };
      }
      return { data, error: null };
    } catch (err) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  // Sign up
  signup: async (email, password, full_name) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', email, password, full_name }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: { message: data.error } };
      }
      return { data, error: null };
    } catch (err) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  // Get list of exams
  getExams: async () => {
    try {
      const response = await fetch(`${API_BASE}/api/exams`);
      const data = await response.json();
      if (!response.ok) {
        return { error: { message: data.error } };
      }
      return { data: data.exams, error: null };
    } catch (err) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  // Get questions for an exam
  getQuestions: async (examId) => {
    try {
      const response = await fetch(`${API_BASE}/api/questions?examId=${examId}`);
      const data = await response.json();
      if (!response.ok) {
        return { error: { message: data.error } };
      }
      return { data, error: null };
    } catch (err) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  // Submit test answers
  submitTest: async (examId, answers) => {
    try {
      const response = await fetch(`${API_BASE}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, answers }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: { message: data.error } };
      }
      return { data, error: null };
    } catch (err) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },
};
