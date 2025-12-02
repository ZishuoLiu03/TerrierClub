// server/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Allow frontend (Vite on 5173) to call this API
app.use(cors());
app.use(express.json());

// In-memory sessions store (reset when server restarts)
const sessions = {};

/**
 * 1. QUESTIONS
 * GET /api/questions
 */
const QUESTIONS = [
  {
    id: 'q1',
    text: 'What excites you most in a group?',
    category: 'Group Role',
    options: [
      { id: 'q1a', text: 'Building something new' },        // Innovator
      { id: 'q1b', text: 'Creative expression' },           // Creator
      { id: 'q1c', text: 'Exploring new places' },          // Explorer
      { id: 'q1d', text: 'Connecting people' },             // Connector
    ],
  },
  {
    id: 'q2',
    text: 'What would you pick for a weekend activity?',
    category: 'Weekend Vibes',
    options: [
      { id: 'q2a', text: 'Hackathon or startup event' },    // Innovator
      { id: 'q2b', text: 'Art or fashion workshop' },       // Creator
      { id: 'q2c', text: 'Hiking / travel' },               // Explorer
      { id: 'q2d', text: 'Volunteering / community event' } // Connector
    ],
  },
  {
    id: 'q3',
    text: 'What type of content do you consume most?',
    category: 'Content Preference',
    options: [
      { id: 'q3a', text: 'Tech / entrepreneurship videos' }, // Innovator
      { id: 'q3b', text: 'Design / fashion / aesthetics' },  // Creator
      { id: 'q3c', text: 'Travel / exploration vlogs' },     // Explorer
      { id: 'q3d', text: 'Social issues / activism' },       // Connector
    ],
  },
  {
    id: 'q4',
    text: 'What role do you tend to take in group work?',
    category: 'Role Preference',
    options: [
        { id: 'q4a', text: 'Visionary / idea person' },
        { id: 'q4b', text: 'Designer / creative' },
        { id: 'q4c', text: 'Curious explorer' },
        { id: 'q4d', text: 'Connector / communicator' },
    ],
  },
  {
    id: 'q5',
    text: 'You prefer clubs that are:',
    category: 'Group preference',
    options: [
        { id: 'q5a', text: 'Innovation-focused' },
        { id: 'q5b', text: 'Creativity-focused' },
        { id: 'q5c', text: 'Globally curious' },
        { id: 'q5d', text: 'Community-focused' },
    ],
  },
  {
    id: 'q6',
    text: 'Which outcome matters more to you?',
    category: 'Outcome preference',
    options: [
        { id: 'q6a', text: 'Lauching ideas' },
        { id: 'q6b', text: 'Expressing identity' },
        { id: 'q6c', text: 'Gaining experiences' },
        { id: 'q6d', text: 'Helping others' },
    ],
  },
];

app.get('/api/questions', (req, res) => {
  res.json(QUESTIONS);
});

/**
 * 2. INIT SESSION
 * POST /api/init-session
 * body: { sessionId, nickname }
 */
app.post('/api/init-session', (req, res) => {
  const { sessionId, nickname } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      nickname: nickname || 'Anonymous',
      answers: [], // { questionId, optionId }
    };
  } else {
    // update nickname if changed
    if (nickname) {
      sessions[sessionId].nickname = nickname;
    }
  }

  res.json({ sessionId });
});

/**
 * 3. SUBMIT ANSWER
 * POST /api/submit
 * body: { sessionId, questionId, optionId }
 */
app.post('/api/submit', (req, res) => {
  const { sessionId, questionId, optionId } = req.body;

  if (!sessionId || !questionId || !optionId) {
    return res
      .status(400)
      .json({ error: 'sessionId, questionId, and optionId are required' });
  }

  const session = sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  // Replace answer for that question if it already exists
  const existingIndex = session.answers.findIndex(
    (a) => a.questionId === questionId
  );
  if (existingIndex >= 0) {
    session.answers[existingIndex].optionId = optionId;
  } else {
    session.answers.push({ questionId, optionId });
  }

  res.json({ ok: true });
});

/**
 * 4. RESULTS (persona + recommendations)
 * GET /api/results?sessionId=...
 */
app.get('/api/results', (req, res) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const session = sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const persona = computePersona(session.answers);
  const recommendations = computeRecommendations(persona.type);

  res.json({
    persona,
    recommendations,
  });
});

// ---------------- PERSONA + RECOMMENDATIONS LOGIC ----------------

// Map optionId -> persona type for scoring
const OPTION_TO_PERSONA = {
  // q1
  q1a: 'Innovator',
  q1b: 'Creator',
  q1c: 'Explorer',
  q1d: 'Connector',

  // q2
  q2a: 'Innovator',
  q2b: 'Creator',
  q2c: 'Explorer',
  q2d: 'Connector',

  // q3
  q3a: 'Innovator',
  q3b: 'Creator',
  q3c: 'Explorer',
  q3d: 'Connector',

  // q4
  q4a: 'Innovator',
  q4b: 'Creator',
  q4c: 'Explorer',
  q4d: 'Connector',

  // q5
  q5a: 'Innovator',
  q5b: 'Creator',
  q5c: 'Explorer',
  q5d: 'Connector',

  // q6
  q6a: 'Innovator',
  q6b: 'Creator',
  q6c: 'Explorer',
  q6d: 'Connector',
};

const PERSONA_DETAILS = {
  Explorer: {
    type: 'Explorer',
    description:
      'You love discovering new communities, causes, and experiences on and beyond campus.',
    tags: ['Global', 'Outdoors', 'Curious'],
  },
  Innovator: {
    type: 'Innovator',
    description:
      'You get energy from building new things, solving problems, and experimenting with ideas.',
    tags: ['Builder', 'Analytical', 'Ambitious'],
  },
  Creator: {
    type: 'Creator',
    description:
      'You express yourself through art, design, and creative projects, and care about aesthetics.',
    tags: ['Artistic', 'Expressive', 'Visual'],
  },
  Connector: {
    type: 'Connector',
    description:
      'You thrive when bringing people together and building a sense of community.',
    tags: ['Social', 'Supportive', 'Community-Oriented'],
  },
};

// All orgs: some BU, some external
const ALL_ORGS = [
  {
    id: '1',
    name: 'BU Hiking Club',
    type: 'BU',
    description:
      'Weekly hikes and outdoor adventures around New England with other BU students.',
    tags: ['Outdoors', 'Adventure', 'Nature'],
    personas: ['Explorer', 'Connector'],
  },
  {
    id: '2',
    name: 'BU Developers Club',
    type: 'BU',
    description:
      'Student-run community for software projects, hackathons, and tech talks.',
    tags: ['Coding', 'Projects', 'Tech'],
    personas: ['Innovator'],
  },
  {
    id: '3',
    name: 'BU Art & Design Collective',
    type: 'BU',
    description:
      'Collaborative space for students interested in visual arts, design, and creative showcases.',
    tags: ['Art', 'Design', 'Creative'],
    personas: ['Creator'],
  },
  {
    id: '4',
    name: 'Boston Climate Action Network',
    type: 'External',
    description:
      'Local group focused on climate policy, advocacy, and community organizing in Boston.',
    tags: ['Climate', 'Advocacy', 'Community'],
    personas: ['Explorer', 'Connector'],
  },
  {
    id: '5',
    name: 'Tech for Social Good Boston',
    type: 'External',
    description:
      'Meetup group for using technology and data to tackle local social challenges.',
    tags: ['Tech', 'Impact', 'Civic'],
    personas: ['Innovator', 'Connector'],
  },
];

// Compute persona from answers
function computePersona(answers) {
  const scores = {
    Explorer: 0,
    Innovator: 0,
    Creator: 0,
    Connector: 0,
  };

  for (const ans of answers) {
    const personaType = OPTION_TO_PERSONA[ans.optionId];
    if (personaType && scores[personaType] !== undefined) {
      scores[personaType] += 1;
    }
  }

  // Pick highest-scoring persona; break ties by fixed order
  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const bestType = ordered[0][0];

  return PERSONA_DETAILS[bestType];
}

// Compute recommendations based on persona
function computeRecommendations(personaType) {
  // Filter orgs that list this persona
  const matches = ALL_ORGS.filter((org) =>
    org.personas.includes(personaType)
  );

  // Add matchLabel and url fields for frontend
  return matches.map((org) => ({
    ...org,
    matchLabel:
      personaType === 'Explorer'
        ? 'Great fit for your Explorer side'
        : personaType === 'Innovator'
        ? 'Matches your Innovator energy'
        : personaType === 'Creator'
        ? 'Aligns with your Creator style'
        : 'Fits your Connector strengths',
    url:
      org.type === 'BU'
        ? 'https://www.bu.edu' // placeholder
        : 'https://www.google.com/search?q=' +
          encodeURIComponent(org.name + ' Boston'),
  }));
}

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});