const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

// Auth
export async function register(type, token) {
  const data = type === 'google' 
    ? { type: '1', accesstoken: token }
    : { type: '2', accesscode: token };
  
  return apiCall('/quiz/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(type, token) {
  const data = type === 'google' 
    ? { type: '1', accesstoken: token }
    : { type: '2', accesscode: token };
  
  return apiCall('/quiz/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logout() {
  return apiCall('/quiz/auth/logout', { method: 'POST' });
}

// Questions
export async function getCurrentRound() {
  return apiCall('/quiz/getRound');
}

export async function submitRoundAnswer(answer) {
  return apiCall('/quiz/checkRound', {
    method: 'POST',
    body: JSON.stringify({ answer }),
  });
}

// Clues
export async function getClues() {
  return apiCall('/quiz/getClue');
}

export async function submitClueAnswer(clueId, answer) {
  return apiCall('/quiz/checkClue', {
    method: 'POST',
    body: JSON.stringify({ clue_id: clueId, answer }),
  });
}

// Leaderboard
export async function getLeaderboard() {
  return apiCall('/quiz/leaderboard');
}

export async function getUserScore() {
  return apiCall('/quiz/user');
}