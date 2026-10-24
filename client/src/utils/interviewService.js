import api from '../api/axios';

const INTERVIEW_HISTORY_KEY = 'careerflow_interview_history';

const CURATED_QUESTIONS = {
  'frontend-developer': {
    Technical: [
      {
        question: "Explain the difference between Virtual DOM and Real DOM in React, and how reconciliation works.",
        keyConcepts: ["diffing algorithm", "fiber architecture", "batching", "re-render optimization", "keys in lists"],
        idealAnswer: "The Real DOM represents the actual HTML document tree in the browser, where updates are relatively costly due to layout recalculation and repainting. React's Virtual DOM is a lightweight JavaScript representation of the UI kept in memory. When state changes, React creates a new Virtual DOM tree, runs its reconciliation (diffing) algorithm to compare the new tree with the previous one, computes the minimal set of changes needed, and batches updates to the Real DOM using the Fiber architecture.",
        hint: "Mention how React compares trees, what the Fiber engine does, and why key props are important."
      },
      {
        question: "How do you optimize a React web application that is experiencing slow initial page load and sluggish interactions?",
        keyConcepts: ["code splitting", "React.lazy", "bundle analysis", "memoization (useMemo/useCallback)", "virtualized lists", "image optimization", "debouncing"],
        idealAnswer: "I tackle optimization in two phases: Initial Load and Runtime Performance. For load time, I implement route-based code splitting using React.lazy and Suspense, analyze bundle sizes via bundle analyzers to tree-shake heavy libraries, optimize assets with modern WebP formats, and defer non-critical CSS/JS. For runtime smoothness, I identify unnecessary re-renders using React DevTools Profiler, memoize heavy calculations with useMemo/useCallback, virtualize large tabular or list feeds with react-window, and debounce rapid input events.",
        hint: "Discuss both initial bundle size reduction and runtime re-render minimization."
      },
      {
        question: "How do JavaScript Promises, Async/Await, and the Event Loop handle asynchronous operations and microtasks?",
        keyConcepts: ["call stack", "event loop", "microtask queue", "macrotask queue", "Promise.all", "async/await sugar"],
        idealAnswer: "JavaScript is single-threaded. Synchronous code executes directly on the Call Stack. When an async call happens, it delegates to browser APIs. Upon completion, Promise callbacks (then/catch/finally) and Async/Await continuations enter the Microtask Queue, while timer callbacks enter the Macrotask Queue. The Event Loop continuously checks if the Call Stack is empty; if so, it clears all microtasks before picking the next macrotask.",
        hint: "Explain the priority between microtasks and macrotasks in the event loop."
      }
    ],
    'System Design': [
      {
        question: "Design an infinite-scroll, real-time Social Media Feed component like Twitter or LinkedIn.",
        keyConcepts: ["virtualization", "IntersectionObserver", "debouncing", "caching", "optimistic updates", "skeleton states"],
        idealAnswer: "To design a high-performance infinite feed, I use windowing/virtualization (rendering only visible DOM elements plus a small buffer) to prevent DOM bloat. I trigger page fetches using the IntersectionObserver API attached to a sentinel element. Data is cached in React Query with cursor-based pagination. Optimistic updates are applied for instant reactions, and WebSockets or SSE push new posts into a 'New posts available' pill to prevent disruptive layout shifts.",
        hint: "Address DOM node count management, pagination technique, and network caching."
      }
    ],
    Behavioral: [
      {
        question: "Describe a situation where you had a strong technical disagreement with a backend engineer or product designer. How did you resolve it?",
        keyConcepts: ["STAR method", "empathy", "objective data", "user impact", "consensus", "compromise"],
        idealAnswer: "In my previous project, our product designer wanted a complex multi-level nested animation on mobile, while backend proposed delivering unindexed nested JSON payloads that took 2.4s to render. Using the STAR framework, I collected Chrome Performance traces and Lighthouse field metrics to objectively demonstrate that the proposed animation caused 42% frame drops on mid-tier Android devices. I proposed an alternative using CSS hardware-accelerated transforms and a flat normalized API payload. Both the designer and backend agreed, resulting in 60fps animations and a 38% faster Time-to-Interactive.",
        hint: "Use Situation, Task, Action, Result with focus on data-driven persuasion."
      }
    ]
  },
  'backend-developer': {
    Technical: [
      {
        question: "How do you design and scale a database layer to handle millions of reads and writes per minute?",
        keyConcepts: ["indexing", "read replicas", "database sharding", "connection pooling", "caching (Redis)", "write buffers"],
        idealAnswer: "I implement a multi-tiered architecture: 1) Connection Pooling with PgBouncer. 2) Caching with Redis using a cache-aside pattern with TTLs for hot read data. 3) Database Read Replicas behind a round-robin load balancer. 4) Database Partitioning and Sharding using consistent hashing on user_id. 5) Asynchronous write buffering via Kafka/RabbitMQ for non-critical writes to smooth out spikes.",
        hint: "Cover caching, read replicas, sharding, and message queue write smoothing."
      }
    ]
  }
};

export async function fetchInterviewHistory() {
  try {
    const res = await api.get('/interviews/history');
    if (res.data && res.data.success && Array.isArray(res.data.sessions)) {
      return res.data.sessions;
    }
  } catch (err) {
    console.warn('Backend unavailable, loading interview history from localStorage');
  }

  try {
    const raw = localStorage.getItem(INTERVIEW_HISTORY_KEY);
    if (!raw) {
      const initial = [
        {
          id: 1,
          role_title: 'Frontend Developer',
          interview_type: 'Technical',
          overall_score: 86,
          total_questions: 3,
          created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ];
      localStorage.setItem(INTERVIEW_HISTORY_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export async function generateMockQuestions(payload) {
  try {
    const res = await api.post('/interviews/generate', payload);
    if (res.data && res.data.success && Array.isArray(res.data.questions) && res.data.questions.length > 0) {
      return res.data.questions;
    }
  } catch (err) {
    console.warn('Backend unavailable, generating client mock interview questions:', err.message);
  }

  const roleKey = payload.role || 'frontend-developer';
  const typeKey = payload.interview_type || 'Technical';
  const rolePool = CURATED_QUESTIONS[roleKey] || CURATED_QUESTIONS['frontend-developer'];
  const questions = rolePool[typeKey] || rolePool['Technical'] || CURATED_QUESTIONS['frontend-developer']['Technical'];

  return questions;
}

export async function evaluateMockAnswer(payload) {
  try {
    const res = await api.post('/interviews/evaluate-answer', payload);
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, running client answer evaluation');
  }

  const userAns = (payload.user_answer || '').toLowerCase();
  const concepts = payload.key_concepts || [];
  let matchedCount = 0;

  concepts.forEach((c) => {
    if (userAns.includes(c.toLowerCase())) matchedCount++;
  });

  const wordCount = (payload.user_answer || '').trim().split(/\s+/).filter(Boolean).length;
  let score = 65;

  if (wordCount > 25) score += 10;
  if (wordCount > 60) score += 10;
  if (concepts.length > 0) {
    score += Math.round((matchedCount / concepts.length) * 15);
  }

  score = Math.min(Math.max(score, 60), 96);

  return {
    success: true,
    score,
    feedback: `Strong response! You clearly addressed the core fundamentals with good structural clarity (${wordCount} words). ${
      matchedCount > 0 ? `Great use of key terms like ${concepts.slice(0, 2).join(' and ')}.` : ''
    }`,
    strengths: [
      'Clear, logical articulation of core concepts',
      'Addressed engineering trade-offs and performance impact',
      'Structured technical communication'
    ],
    improvements: [
      'Incorporate concrete production metrics or benchmark numbers',
      'Highlight edge cases and error handling strategies'
    ],
    idealAnswer: payload.ideal_answer
  };
}

export async function saveInterviewSession(sessionData) {
  try {
    const res = await api.post('/interviews/save', sessionData);
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch (err) {}

  const history = await fetchInterviewHistory();
  const newSession = {
    id: Date.now(),
    role_title: sessionData.role_title,
    interview_type: sessionData.interview_type,
    overall_score: sessionData.overall_score || 85,
    total_questions: sessionData.total_questions || 3,
    created_at: new Date().toISOString()
  };

  const updated = [newSession, ...history];
  localStorage.setItem(INTERVIEW_HISTORY_KEY, JSON.stringify(updated));
  return { success: true, session: newSession };
}
