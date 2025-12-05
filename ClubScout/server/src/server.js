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
app.get('/api/results', async (req, res) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const session = sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const persona = computePersona(session.answers);
  const recommendations = await computeRecommendations(persona.type, session.answers);

  res.json({
    persona,
    recommendations,
  });
});

/**
 * 5. FEEDBACK
 * POST /api/feedback
 * Body: { sessionId, rating, feedback }
 */
app.post('/api/feedback', (req, res) => {
  const { sessionId, rating, feedback } = req.body;
  console.log(`[FEEDBACK] Session: ${sessionId}, Rating: ${rating}, Feedback: ${feedback}`);
  res.json({ success: true });
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

// Load clubs from CSV
const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../../../Data/terrier_clubs_contacts.csv');
const keywordsPath = path.join(__dirname, '../../../Data/terrier_clubs_keywords.csv');

let ALL_CLUBS = [];
const OPENAI_API_KEY = "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"; // User to replace this

function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = [];
    let inQuotes = false;
    let currentValue = '';

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    row.push(currentValue);

    if (row.length > 0) {
      const obj = {};
      if (row[0]) obj.name = row[0].trim();
      if (row[1]) obj.url = row[1].trim();
      result.push(obj);
    }
  }
  return result;
}

function loadKeywords() {
  try {
    const data = fs.readFileSync(keywordsPath, 'utf8');
    const lines = data.split(/\r?\n/);
    const keywordMap = {};

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple split by comma for the first column (Name), rest is keywords
      // But keywords field itself might contain semicolons.
      // CSV format: "Club Name,Keywords"
      // We need to be careful if Club Name has comma, but usually it's "Name","Keywords" or Name,Keywords
      // Let's use a regex or simple split if we assume no commas in names or quoted names.
      // The previous parseCSV is robust enough, let's reuse a simplified version or just split by first comma if not quoted.

      // Actually, let's reuse the robust logic but adapted for this file structure
      // Or simpler: split by first comma?
      // Let's use the robust logic.

      const row = [];
      let inQuotes = false;
      let currentValue = '';
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') { inQuotes = !inQuotes; }
        else if (char === ',' && !inQuotes) {
          row.push(currentValue);
          currentValue = '';
        } else { currentValue += char; }
      }
      row.push(currentValue);

      if (row.length >= 2) {
        const name = row[0].trim();
        const keywordsStr = row[1].trim();
        // Keywords are semicolon separated
        const keywords = keywordsStr.split(';').map(k => k.trim()).filter(k => k);
        keywordMap[name] = keywords;
      }
    }
    return keywordMap;
  } catch (err) {
    console.error('Failed to load keywords CSV:', err);
    return {};
  }
}

try {
  const contactsData = fs.readFileSync(csvPath, 'utf8');
  const clubs = parseCSV(contactsData);
  const keywordMap = loadKeywords();

  // Merge keywords into clubs
  ALL_CLUBS = clubs.map(club => ({
    ...club,
    keywords: keywordMap[club.name] || []
  }));

  console.log(`Loaded ${ALL_CLUBS.length} clubs. ${Object.keys(keywordMap).length} clubs have keywords.`);
} catch (err) {
  console.error('Failed to load clubs data:', err);
}

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

// Fake external clubs for demonstration
const EXTERNAL_CLUBS = [
  { name: "Boston Climate Action Network", url: "https://www.bostoncan.org", description: "Local group focused on climate policy and advocacy." },
  { name: "Tech for Social Good Boston", url: "https://www.meetup.com/tech-for-social-good", description: "Meetup group for using technology to tackle social challenges." },
  { name: "Volunteer Match Boston", url: "https://www.volunteermatch.org", description: "Find volunteer opportunities in the greater Boston area." },
  { name: "Boston Hikers", url: "https://www.meetup.com/boston-hikers", description: "Community of hiking enthusiasts exploring New England trails." },
  { name: "Boston Art & Music Soul", url: "https://www.bamsfest.org", description: "Celebrating Afro-centric culture, heritage, and contributions." },
  { name: "General Assembly Boston", url: "https://generalassemb.ly/boston", description: "Workshops and courses in coding, design, and data." },
  { name: "Boston Cares", url: "https://www.bostoncares.org", description: "Largest volunteer agency in New England." },
  { name: "SoWa Artists Guild", url: "https://sowaartists.com", description: "Association of professional studio artists in the SoWa Art & Design District." }
];

const VALID_KEYWORDS = [
  'Business', 'Healthcare', 'Community Service', 'Technology', 'Engineering',
  'Music', 'Dance', 'Theater', 'Visual Arts', 'Writing', 'Film & Media',
  'Professional Development', 'Social Justice', 'Environmental', 'LGBTQ+',
  'Greek Life', 'Science', 'Law', 'Politics', 'International', 'Fitness',
  'Mental Wellness', 'Food & Cooking', 'Gaming', 'Christian', 'Jewish',
  'Buddhist', 'African', 'Latin American', 'South Asian', 'East Asian',
  'Southeast Asian', 'Middle Eastern', 'Caribbean', 'Women-Focused',
  'Individual Sports', 'Team Sports', 'General Interest'
];

async function generateKeywordsFromOpenAI(answers) {
  // Construct prompt from answers
  // We need the question text and the selected option text
  // We can get this from the QUESTIONS array and the answers array
  // But answers only has IDs. We need to map back.

  // For MVP/Speed, let's just use the answer IDs or try to look them up.
  // The `QUESTIONS` array is available in this scope.

  let prompt = `Based on the following quiz answers, select exactly 5 keywords that best describe what type of student clubs this person would enjoy.

You MUST choose from this list only:
${VALID_KEYWORDS.join(', ')}

Return ONLY a JSON array of 5 strings in order of relevance.

`;

  answers.forEach(ans => {
    const q = QUESTIONS.find(q => q.id === ans.questionId || q.id === 'q' + ans.questionId); // Handle potential ID mismatch if any
    // Actually QUESTIONS uses 'q1', 'q2' etc. answers might use numbers or strings.
    // Let's assume standard format or look up loosely.

    // In server.js QUESTIONS are defined with ids 'q1', 'q2'...
    // In routes.js (which we replaced logic from) it was DB based.
    // Here we are in server.js, using in-memory QUESTIONS.
    // The submit endpoint stores { questionId, optionId }.

    // Let's find the question and option text.
    const question = QUESTIONS.find(q => q.id === ans.questionId);
    if (question) {
      const option = question.options.find(o => o.id === ans.optionId);
      if (option) {
        prompt += `Q: ${question.text}\nA: ${option.text}\n`;
      }
    }
  });

  console.log("OpenAI Prompt:", prompt);

  if (OPENAI_API_KEY === "key_here") {
    console.log("Using mock OpenAI response (no valid key provided)");
    // Mock response based on simple heuristics or random from a set
    // For demonstration, let's return a fixed set or slightly dynamic based on persona if we computed it earlier
    // But here we are inside the function.
    return ["Community Service", "Social Justice", "Professional Development", "Technology", "General Interest"];
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    // Parse JSON from content
    // It might be wrapped in markdown code blocks
    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to generate keywords from OpenAI:", error);
    return ["General Interest", "Community Service", "Social", "Professional Development", "Fun"]; // Fallback
  }
}

// Compute recommendations based on persona
async function computeRecommendations(personaType, answers) {
  // 1. Generate Keywords
  const rankedKeywords = await generateKeywordsFromOpenAI(answers || []);
  console.log("Generated Keywords:", rankedKeywords);

  // 2. Score BU Clubs
  // Scoring: 1st keyword = 5 pts, 2nd = 4 pts, ... 5th = 1 pt.
  const scoredClubs = ALL_CLUBS.map(club => {
    let score = 0;
    const clubKeywords = club.keywords || [];

    rankedKeywords.forEach((kw, index) => {
      // Case-insensitive exact match
      const weight = 5 - index;
      if (weight > 0) {
        // Check if any club keyword matches this generated keyword exactly
        const match = clubKeywords.some(ckw => ckw.toLowerCase() === kw.toLowerCase());
        if (match) {
          score += weight;
        }
      }
    });
    return { ...club, score };
  });

  // Sort by score descending
  scoredClubs.sort((a, b) => b.score - a.score);

  // Take top 5
  const selectedBU = scoredClubs.slice(0, 5);

  // Randomly select 5 External clubs (keep random for now as requested)
  const shuffledExternal = [...EXTERNAL_CLUBS].sort(() => 0.5 - Math.random());
  const selectedExternal = shuffledExternal.slice(0, 5);

  const buRecommendations = selectedBU.map((club, index) => ({
    id: `bu-${index}-${Date.now()}`,
    name: club.name,
    type: 'BU',
    description: `Matches keywords: ${club.keywords.filter(k => rankedKeywords.some(rk => k.toLowerCase() === rk.toLowerCase())).join(', ') || 'General'}`, // Show matched keywords for debug/info
    tags: club.keywords.slice(0, 3), // Show first 3 tags
    matchLabel: `Match Score: ${club.score}`,
    url: club.url
  }));

  const externalRecommendations = selectedExternal.map((club, index) => ({
    id: `ext-${index}-${Date.now()}`,
    name: club.name,
    type: 'External',
    description: club.description,
    tags: [],
    matchLabel: 'External Opportunity',
    url: club.url
  }));

  return [...buRecommendations, ...externalRecommendations];
}

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});