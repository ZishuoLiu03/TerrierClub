const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const questions = [
  {
    text: "What's your ideal Friday night?",
    category: "Social",
    options: [
      { text: "Large party with loud music", value: "party" },
      { text: "Board games with close friends", value: "casual" },
      { text: "Coding hackathon", value: "tech" },
      { text: "Reading a book alone", value: "introvert" },
    ],
  },
  {
    text: "How often do you want to meet?",
    category: "Commitment",
    options: [
      { text: "Every day", value: "high" },
      { text: "Once a week", value: "medium" },
      { text: "Once a month", value: "low" },
    ],
  },
  {
    text: "What are you looking for?",
    category: "Goal",
    options: [
      { text: "Professional networking", value: "career" },
      { text: "Making new friends", value: "social" },
      { text: "Learning a new skill", value: "learning" },
    ],
  },
];

const clubs = [
  { name: "Hackathon Club", description: "Build cool projects every weekend!", tags: "tech,career,high" },
  { name: "Board Game Society", description: "Relax and play Catan, Monopoly, and more.", tags: "casual,social,medium" },
  { name: "Debate Team", description: "Sharpen your speaking skills.", tags: "career,learning,high" },
  { name: "Book Worms", description: "Quiet reading sessions and monthly discussions.", tags: "introvert,learning,low" },
  { name: "Party Planners", description: "We organize the biggest campus events.", tags: "party,social,high" },
];

async function main() {
  console.log('Start seeding ...');
  
  // Seed Questions (Upsert to avoid duplicates if running multiple times)
  for (const q of questions) {
    // Check if exists first to avoid complex upsert logic for nested relations in this simple script
    const existing = await prisma.question.findFirst({ where: { text: q.text } });
    if (!existing) {
      await prisma.question.create({
        data: {
          text: q.text,
          category: q.category,
          options: {
            create: q.options,
          },
        },
      });
      console.log(`Created question: ${q.text}`);
    }
  }

  // Seed Clubs
  for (const c of clubs) {
    const existing = await prisma.club.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.club.create({ data: c });
      console.log(`Created club: ${c.name}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
