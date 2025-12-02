// Use current hostname (works for localhost and local IP)
const API_URL = `http://${window.location.hostname}:3000/api`;

async function initSession(nickname) {
  // Reuse any existing sessionId so recommendations can be recomputed later
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    // Generate a simple UUID-ish id
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }
    localStorage.setItem('sessionId', sessionId);
  }

  const res = await fetch(`${API_URL}/init-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, nickname }),
  });

  if (!res.ok) {
    throw new Error('Failed to init session');
  }

  return res.json(); // { sessionId }
}

async function getQuestions() {
  const res = await fetch(`${API_URL}/questions`);
  if (!res.ok) {
    throw new Error('Failed to load questions');
  }
  return res.json();
}

async function submitAnswer(sessionId, questionId, optionId) {
  const res = await fetch(`${API_URL}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, questionId, optionId }),
  });

  if (!res.ok) {
    throw new Error('Failed to submit answer');
  }
  return res.json();
}

async function getResults(sessionId) {
  const res = await fetch(`${API_URL}/results?sessionId=${sessionId}`);
  if (!res.ok) {
    throw new Error('Failed to load results');
  }
  return res.json(); // { persona, recommendations }
}

export const api = {
  initSession,
  getQuestions,
  submitAnswer,
  getResults,
};