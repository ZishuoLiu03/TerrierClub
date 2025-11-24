// Use current hostname (works for localhost and local IP)
const API_URL = `http://${window.location.hostname}:3000/api`;

export const api = {
    async initSession(nickname) {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            // Fallback for non-secure contexts (http://IP) where crypto.randomUUID is not available
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                sessionId = crypto.randomUUID();
            } else {
                sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
            localStorage.setItem('sessionId', sessionId);
        }

        const response = await fetch(`${API_URL}/init-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, nickname }),
        });
        return response.json();
    },

    async getQuestions() {
        const response = await fetch(`${API_URL}/questions`);
        return response.json();
    },

    async submitAnswer(sessionId, questionId, optionId) {
        const response = await fetch(`${API_URL}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, questionId, optionId }),
        });
        return response.json();
    },

    async getRecommendations(sessionId) {
        const response = await fetch(`${API_URL}/recommendations?sessionId=${sessionId}`);
        return response.json();
    }
};
