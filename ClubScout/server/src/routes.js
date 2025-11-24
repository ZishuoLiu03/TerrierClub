const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await prisma.question.findMany({
            include: {
                options: true,
            },
        });
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Initialize session (create user if not exists, or just return sessionId)
// Updated to accept nickname
router.post('/init-session', async (req, res) => {
    const { sessionId, nickname } = req.body;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }

    try {
        let user = await prisma.user.findUnique({
            where: { sessionId },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    sessionId,
                    nickname: nickname || null
                },
            });
        } else if (nickname) {
            // Update nickname if provided and user exists
            user = await prisma.user.update({
                where: { sessionId },
                data: { nickname },
            });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to initialize session' });
    }
});

// Submit an answer
router.post('/submit', async (req, res) => {
    const { sessionId, questionId, optionId } = req.body;

    if (!sessionId || !questionId || !optionId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { sessionId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const submission = await prisma.submission.upsert({
            where: {
                userId_questionId: {
                    userId: user.id,
                    questionId: parseInt(questionId),
                },
            },
            update: {
                optionId: parseInt(optionId),
                timestamp: new Date(),
            },
            create: {
                userId: user.id,
                questionId: parseInt(questionId),
                optionId: parseInt(optionId),
            },
        });

        res.json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit answer' });
    }
});

// Get Recommendations
router.get('/recommendations', async (req, res) => {
    const { sessionId } = req.query;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }

    try {
        // 1. Get user submissions
        const user = await prisma.user.findUnique({
            where: { sessionId },
            include: {
                submissions: {
                    include: { option: true }
                }
            }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        // 2. Collect tags from answers (simple logic: if answer value matches a club tag)
        // For MVP, we'll just return all clubs, but sorted by "relevance" if we had complex logic.
        // Let's do a simple filter: if any answer value is present in club tags.

        const userTags = user.submissions.map(s => s.option.value);

        const allClubs = await prisma.club.findMany();

        // Simple ranking: count how many user tags match club tags
        const rankedClubs = allClubs.map(club => {
            const clubTags = club.tags.split(',');
            const matchCount = clubTags.filter(tag => userTags.includes(tag)).length;
            return { ...club, matchCount };
        });

        // Sort by match count descending
        rankedClubs.sort((a, b) => b.matchCount - a.matchCount);

        res.json(rankedClubs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

module.exports = router;
