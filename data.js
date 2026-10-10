export const masterAchievements = [
    { id: 'Fire Safety Pro', name: 'Fire Safety Pro', description: 'Score 50+ points overall.' },
    { id: 'Earthquake Expert', name: 'Earthquake Expert', description: 'Score 100+ points overall.' },
    { id: 'All-Rounder', name: 'All-Rounder', description: 'Score 150+ points overall.' },
    { id: 'Safety Superstar', name: 'Safety Superstar', description: 'Score 300+ points overall.' },
    { id: 'Quiz Novice', name: 'Quiz Novice', description: 'Complete any quiz.' },
    { id: 'Fire Quiz Master', name: 'Fire Quiz Master', description: 'Master the Fire Safety quiz.' },
    { id: 'Earthquake Quiz Master', name: 'Earthquake Quiz Master', description: 'Master the Earthquake quiz.' },
    { id: 'Tornado Quiz Master', name: 'Tornado Quiz Master', description: 'Master the Tornado quiz.' },
    { id: 'Flood Quiz Master', name: 'Flood Quiz Master', description: 'Master the Flood Safety quiz.' },
    { id: 'Wildfire Quiz Master', name: 'Wildfire Quiz Master', description: 'Master the Wildfire quiz.' },
    { id: 'Hurricane Quiz Master', name: 'Hurricane Quiz Master', description: 'Master the Hurricane quiz.' },
    { id: 'Response Protocol Master', name: 'Response Protocol Master', description: 'Master the Response Protocol quiz.' },
    { id: 'Level 5 Reached', name: 'Good job!', description: 'Bravo' },
    { id: 'Pro', name: 'Pro', description: 'Pro level brainy!' },
    { id: 'Perfect Score', name: 'Perfect Score', description: 'Get a perfect score on any quiz.' },
    { id: 'Triple Threat', name: 'Triple Threat', description: 'Complete 3 different quizzes.' },
    { id: 'Penta-Perfect', name: 'Penta-Perfect', description: 'Complete 5 different quizzes.' },
    { id: 'Safety Savant', name: 'Safety Savant', description: 'Complete all available quizzes.' },
];

export const localDB = {
    score: 0,
    achievements: [],
    completedQuizzes: [],
    lastActive: '2023-10-27T12:00:00Z'
};
