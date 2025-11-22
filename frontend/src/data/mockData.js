export const mockUsers = {
  currentUser: {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe'
  }
};

export const mockNotes = [
  {
    _id: '1',
    title: 'Machine Learning Basics',
    content: `Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from and make predictions on data. There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.

Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data. Reinforcement learning involves training models through rewards and punishments.

Key concepts include:
- Training and test datasets
- Features and labels
- Model evaluation metrics
- Overfitting and underfitting`,
    category: 'Study',
    tags: ['ai', 'machine learning', 'algorithms'],
    user: '1',
    aiAnalysis: {
      summary: 'Machine learning involves algorithms that learn from data to make predictions. The three main types are supervised, unsupervised, and reinforcement learning, each with different approaches to training models.',
      keywords: ['algorithms', 'supervised learning', 'unsupervised learning', 'reinforcement learning', 'training data'],
      questions: [
        'What are the three main types of machine learning?',
        'How does supervised learning differ from unsupervised learning?',
        'What is the role of training and test datasets?',
        'What are features and labels in machine learning?',
        'What is overfitting and how can it be prevented?'
      ],
      simplifiedContent: 'Machine learning is about teaching computers to learn from data. There are three main ways: learning with answers provided (supervised), finding patterns without answers (unsupervised), and learning through trial and error (reinforcement).',
      tone: 'academic',
      lastAnalyzed: '2024-01-15T10:30:00Z'
    },
    isPinned: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    title: 'Project Meeting Notes',
    content: `Weekly team meeting discussed:
- Project timeline adjustments
- New feature requirements from client
- Resource allocation for Q2
- Upcoming deadlines

Action items:
1. Complete user authentication module by Friday
2. Review API documentation
3. Schedule client demo for next week`,
    category: 'Work',
    tags: ['meeting', 'project', 'timeline'],
    user: '1',
    aiAnalysis: {
      summary: 'Weekly team meeting covered project timeline adjustments, new client requirements, resource allocation, and upcoming deadlines with specific action items.',
      keywords: ['timeline', 'requirements', 'resource allocation', 'deadlines', 'action items'],
      questions: [
        'What were the main topics discussed in the meeting?',
        'What are the key action items from the meeting?',
        'When should the user authentication module be completed?',
        'What client requirements were mentioned?'
      ],
      simplifiedContent: 'Team meeting talked about project schedule changes, what the client needs, team member assignments, and due dates. Everyone got specific tasks to do.',
      tone: 'formal',
      lastAnalyzed: '2024-01-14T15:45:00Z'
    },
    isPinned: false,
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-14T15:45:00Z'
  },
  {
    _id: '3',
    title: 'Personal Goals 2024',
    content: `Personal development goals for this year:
- Learn React and Node.js thoroughly
- Read 24 books (2 per month)
- Exercise 4 times per week
- Improve public speaking skills
- Travel to 3 new countries

Progress tracking:
- Currently reading "Atomic Habits"
- Joined local Toastmasters club
- Completed React basics course`,
    category: 'Personal',
    tags: ['goals', 'self-improvement', 'planning'],
    user: '1',
    aiAnalysis: {
      summary: 'Personal goals for 2024 include learning React and Node.js, reading 24 books, regular exercise, improving public speaking, and traveling to new countries with current progress noted.',
      keywords: ['goals', 'learning', 'reading', 'exercise', 'travel', 'progress'],
      questions: [
        'What are the main learning goals for 2024?',
        'How many books does the person plan to read?',
        'What is the exercise frequency goal?',
        'What progress has been made so far?'
      ],
      simplifiedContent: 'This year I want to learn web development, read more books, exercise regularly, get better at speaking in public, and visit new places. I have already started working on some of these goals.',
      tone: 'casual',
      lastAnalyzed: '2024-01-13T14:20:00Z'
    },
    isPinned: true,
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-13T14:20:00Z'
  },
  {
    _id: '4',
    title: 'React Hooks Overview',
    content: `React Hooks are functions that let you use state and other React features in functional components.

Main Hooks:
- useState: For managing state
- useEffect: For side effects
- useContext: For context API
- useReducer: For complex state logic
- useMemo: For memoized values
- useCallback: For memoized functions

Best Practices:
- Only call Hooks at the top level
- Only call Hooks from React functions
- Use eslint-plugin-react-hooks`,
    category: 'Study',
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    user: '1',
    aiAnalysis: {
      summary: 'React Hooks enable state and lifecycle features in functional components, including useState for state management, useEffect for side effects, and other specialized hooks with specific rules for usage.',
      keywords: ['react', 'hooks', 'usestate', 'useeffect', 'functional components', 'state management'],
      questions: [
        'What are React Hooks and why were they introduced?',
        'What is the difference between useState and useReducer?',
        'How does useEffect replace lifecycle methods?',
        'What are the rules of using Hooks?',
        'When should you use useMemo and useCallback?'
      ],
      simplifiedContent: 'React Hooks are tools that let functional components have features like state and side effects. The main hooks are useState for data that changes, useEffect for actions after render, and others for specific needs.',
      tone: 'technical',
      lastAnalyzed: '2024-01-16T09:15:00Z'
    },
    isPinned: false,
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  }
];

export const mockDashboardStats = {
  totalNotes: 12,
  categoryCount: {
    Study: 5,
    Work: 4,
    Personal: 3
  },
  analyzedNotes: 8,
  recentNotes: 3,
  commonTone: 'academic',
  topKeywords: ['learning', 'project', 'goals', 'analysis', 'development', 'react', 'hooks'],
  recentNotesList: mockNotes.slice(0, 3)
};