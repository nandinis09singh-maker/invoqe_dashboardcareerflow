const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// QUESTION BANK BY ROLE & INTERVIEW TYPE
const QUESTION_BANK = {
  'frontend-developer': {
    'Technical': [
      {
        question: "Explain the difference between Virtual DOM and Real DOM in React, and how reconciliation works.",
        keyConcepts: ["diffing algorithm", "fiber architecture", "batching", "re-render optimization", "keys in lists"],
        idealAnswer: "The Real DOM represents the actual HTML document tree in the browser, where updates are relatively costly due to layout recalculation and repainting. React's Virtual DOM is a lightweight JavaScript representation of the UI kept in memory. When state changes, React creates a new Virtual DOM tree, runs its reconciliation (diffing) algorithm to compare the new tree with the previous one, computes the minimal set of changes needed, and batches updates to the Real DOM using the Fiber architecture.",
        hint: "Mention how React compares trees, what the Fiber engine does, and why key props are important."
      },
      {
        question: "How do you optimize a React web application that is experiencing slow initial page load and sluggish interactions?",
        keyConcepts: ["code splitting", "React.lazy", "bundle analysis", "memoization (useMemo/useCallback)", "virtualized lists", "image optimization", "debouncing"],
        idealAnswer: "I tackle optimization in two phases: Initial Load and Runtime Performance. For load time, I implement route-based code splitting using React.lazy and Suspense, analyze bundle sizes via webpack-bundle-analyzer to tree-shake heavy libraries, optimize assets with modern WebP formats, and defer non-critical CSS/JS. For runtime smoothness, I identify unnecessary re-renders using React DevTools Profiler, memoize heavy calculations with useMemo/useCallback, virtualize large tabular or list feeds with react-window, and debounce rapid input events.",
        hint: "Discuss both initial bundle size reduction and runtime re-render minimization."
      },
      {
        question: "Explain CSS Specificity, the Box Model, and how Flexbox differs from CSS Grid in modern layouts.",
        keyConcepts: ["content padding border margin", "inline vs block", "specificity hierarchy", "one-dimensional vs two-dimensional", "box-sizing border-box"],
        idealAnswer: "The CSS Box Model consists of content, padding, border, and margin. Using box-sizing: border-box ensures padding and borders are included within the specified width and height. Specificity determines which style rule takes precedence: Inline styles (1000) > IDs (100) > Classes/Attributes/Pseudo-classes (10) > Elements/Pseudo-elements (1). Flexbox is a one-dimensional layout system ideal for content alignment along a single axis (row or column), whereas CSS Grid is a two-dimensional layout system designed for complex rows and columns simultaneously.",
        hint: "Touch on the 4 specificity weights and the 1D vs 2D difference."
      },
      {
        question: "How do JavaScript Promises, Async/Await, and the Event Loop handle asynchronous operations and microtasks?",
        keyConcepts: ["call stack", "event loop", "microtask queue", "macrotask queue", "Promise.all", "async/await sugar"],
        idealAnswer: "JavaScript is single-threaded. Synchronous code executes directly on the Call Stack. When an async call (like fetch or setTimeout) happens, it delegates to browser APIs. Upon completion, Promise callbacks (then/catch/finally) and Async/Await continuations enter the Microtask Queue, while timer callbacks enter the Macrotask Queue (Task Queue). The Event Loop continuously checks if the Call Stack is empty; if so, it clears all microtasks before picking the next macrotask. Async/Await is syntactic sugar over Promises that makes asynchronous code look synchronous while maintaining non-blocking behavior.",
        hint: "Explain the priority between microtasks and macrotasks in the event loop."
      },
      {
        question: "What strategies do you employ for state management across an enterprise frontend application?",
        keyConcepts: ["local state", "global state", "server state (React Query/RTK Query)", "Context API vs Redux/Zustand", "URL state sync"],
        idealAnswer: "I categorize state into 4 layers: Local Component State (useState/useReducer for UI toggles), Global Client State (Zustand or Redux Toolkit for cross-cutting candidate preferences or sessions), Server Cache State (TanStack Query or RTK Query for caching, background revalidation, and optimistic updates), and URL State (search params for filters and pagination so states are shareable and bookmarkable). This prevents bloated global stores.",
        hint: "Differentiate between server state (cache) and client state."
      }
    ],
    'System Design': [
      {
        question: "Design an infinite-scroll, real-time Social Media Feed component like Twitter or LinkedIn.",
        keyConcepts: ["virtualization", "IntersectionObserver", "debouncing", "caching", "optimistic updates", "skeleton states"],
        idealAnswer: "To design a high-performance infinite feed, I use windowing/virtualization (rendering only visible DOM elements plus a small buffer) to prevent DOM bloat. I trigger page fetches using the IntersectionObserver API attached to a sentinel element. Data is cached in React Query with cursor-based pagination. Optimistic updates are applied for instant like/retweet reactions, and WebSockets or SSE push new posts into a 'New posts available' pill to prevent disruptive layout shifts.",
        hint: "Address DOM node count management, pagination technique, and network caching."
      },
      {
        question: "How would you design a micro-frontend architecture for a large scale enterprise web portal?",
        keyConcepts: ["Module Federation", "isolated deployments", "shared design system", "cross-app routing", "independent versioning"],
        idealAnswer: "I would leverage Webpack 5 Module Federation or single-spa. Each team owns an independent micro-app with its own CI/CD pipeline and deployment lifecycle. A Shell / Host container manages global authentication, shared navigation, and mounts remote modules dynamically. Cross-communication occurs via custom browser events or a lightweight pub/sub event bus, while a shared component library npm package maintains unified design standards.",
        hint: "Talk about Module Federation, the host container, and communication mechanisms."
      }
    ],
    'Behavioral': [
      {
        question: "Describe a situation where you had a strong disagreement with a backend engineer or designer over technical trade-offs. How did you resolve it?",
        keyConcepts: ["STAR method", "empathy", "objective data", "user impact", "consensus", "compromise"],
        idealAnswer: "In my previous project, a backend engineer insisted on returning deeply nested, unpaginated JSON for a dashboard, while our team needed flat, paginated responses for mobile performance. Using the STAR framework: Situation: Mobile load times exceeded 4 seconds. Task: Align on an efficient API contract. Action: I profiled the payload latency and proposed a lightweight GraphQL or query param filter schema with benchmarks. Result: We agreed on cursor pagination with field selection, reducing payload size by 65% and load time to under 800ms.",
        hint: "Follow the STAR framework (Situation, Task, Action, Result) with measurable metrics."
      },
      {
        question: "Tell me about a time when a critical bug occurred in production. How did you diagnose, communicate, and fix it?",
        keyConcepts: ["incident triage", "communication", "root cause analysis (RCA)", "post-mortem", "monitoring"],
        idealAnswer: "We noticed an alert from Sentry indicating users could not submit payment forms after a late deployment. I immediately rolled back the release to restore service, communicated with customer support about affected accounts, isolated the regression to an unhandled null check in the billing address validator, added automated unit tests covering that edge case, and deployed a hotfix. We then held a blameless post-mortem and added end-to-end checkout assertions to our CI pipeline.",
        hint: "Highlight mitigation first (rollback), clear communication, and permanent prevention."
      }
    ],
    'HR': [
      {
        question: "Why are you interested in joining our engineering team, and what kind of technical culture enables you to do your best work?",
        keyConcepts: ["autonomy", "continuous learning", "code review culture", "collaborative ownership", "impact"],
        idealAnswer: "I thrive in an engineering culture that emphasizes high agency, constructive peer code reviews, continuous automated testing, and a focus on real customer impact over vanity metrics. I am drawn to your product because of the engineering rigor required to scale your systems and the chance to contribute to impactful developer or user experiences.",
        hint: "Connect your working style with values of ownership, quality, and collaboration."
      }
    ]
  },
  'backend-developer': {
    'Technical': [
      {
        question: "Explain database indexing, B-Trees vs Hash Indexes, and when an index might degrade performance.",
        keyConcepts: ["B-Tree", "lookup time O(log N)", "composite index", "write overhead", "index selectivity", "table scans"],
        idealAnswer: "A database index is a data structure that accelerates data retrieval at the cost of additional write overhead and storage. B-Trees are balanced trees supporting range queries, ordering, and equality lookups in O(log N) time. Hash indexes offer O(1) equality lookups but cannot do range scans. Indexes degrade performance if added excessively on high-write/insert tables, on low-cardinality columns (e.g. boolean flags), or when index maintenance slows down bulk transactions.",
        hint: "Mention read vs write trade-offs and index cardinality."
      },
      {
        question: "How do you handle distributed transactions across multiple microservices without distributed locks?",
        keyConcepts: ["Saga pattern", "choreography vs orchestration", "compensating transactions", "outbox pattern", "idempotency"],
        idealAnswer: "Instead of two-phase commit (2PC) which introduces tight coupling and latency, I implement the Saga pattern. In a Saga, each local transaction updates the database and publishes an event. If a subsequent step fails, compensating transactions are triggered in reverse to rollback changes. Using the Transactional Outbox pattern guarantees message delivery to Kafka or RabbitMQ, and idempotency keys ensure operations can be retried safely without duplicate effects.",
        hint: "Explain Sagas, compensating transactions, and idempotency."
      },
      {
        question: "How does JWT authentication compare to session-based cookie authentication for backend architectures?",
        keyConcepts: ["stateless vs stateful", "httpOnly cookies", "revocation/blacklisting", "CSRF vs XSS", "token refresh rotation"],
        idealAnswer: "Session-based auth stores session state on the server (e.g. in Redis), making revocation instantaneous, but requiring horizontal session sharing. JWTs are stateless tokens signed cryptographically, meaning microservices can independently verify them without database roundtrips. However, revoking JWTs before expiry requires token blacklisting in memory. In production, I combine them by storing short-lived JWTs (15m) alongside rotating refresh tokens in httpOnly, SameSite cookies to protect against both XSS and CSRF.",
        hint: "Compare scalability, revocation trade-offs, and security best practices."
      }
    ],
    'System Design': [
      {
        question: "Design a URL shortener service like TinyURL or Bitly capable of handling 100M new URLs per month.",
        keyConcepts: ["Base62 encoding", "MD5/SHA256 vs auto-increment counter", "Redis caching", "database partitioning", "read-heavy ratio"],
        idealAnswer: "TinyURL is heavily read-dominant (~100:1 read to write). Writes: We generate unique 7-character short codes using Base62 (62^7 = ~3.5 trillion URLs). We can generate unique IDs via a distributed ID generator (Snowflake) and convert to Base62 to avoid collision loops. Reads: Incoming requests check a distributed Redis cluster (caching the top 20% most accessed URLs). Cache misses query PostgreSQL or MongoDB sharded by short code hash, followed by an HTTP 301/302 redirect.",
        hint: "Explain capacity estimation, Base62 encoding, and the Redis cache layer."
      }
    ],
    'Behavioral': [
      {
        question: "Describe a project where you had to refactor a legacy backend system while keeping it running with zero downtime.",
        keyConcepts: ["Strangler Fig pattern", "feature flags", "shadow traffic", "zero downtime", "monitoring"],
        idealAnswer: "We had a monolithic Ruby service handling order processing that became unstable under scale. We adopted the Strangler Fig pattern. We introduced an API Gateway that routed a small percentage of read traffic to a new Node.js microservice behind feature flags. We mirrored live write traffic to validate output parity between legacy and new services without affecting users. Once 100% parity was verified, we fully migrated traffic and decommissioned the legacy module with zero user downtime.",
        hint: "Mention the Strangler Fig pattern, shadow traffic, and verification."
      }
    ],
    'HR': [
      {
        question: "How do you prioritize between addressing technical debt and shipping new product features?",
        keyConcepts: ["business value", "velocity impact", "risk assessment", "dedicated refactoring budget", "pragmatism"],
        idealAnswer: "I assess tech debt through the lens of business risk and team velocity. High-interest debt that blocks team velocity or risks data integrity is quantified and scheduled alongside product milestones (e.g. 20% time allocation per sprint). Routine debt is improved iteratively via the Boy Scout rule—leaving code cleaner than we found it.",
        hint: "Frame tech debt as a risk and velocity problem with practical sprint allocation."
      }
    ]
  },
  'full-stack-developer': {
    'Technical': [
      {
        question: "Walk through the entire journey of an HTTP POST request from user button click to database row and back.",
        keyConcepts: ["DNS resolution", "TLS handshake", "reverse proxy/Nginx", "middleware", "ORM/SQL query", "HTTP response status", "UI state update"],
        idealAnswer: "When a user clicks submit, the browser triggers an event listener that executes an async Axios/fetch POST request. The request resolves DNS to an IP, establishes a TLS connection, and hits an API Gateway or Nginx reverse proxy. The Express server passes the request through CORS, Helmet, body parser, and auth middleware. Route handlers validate payload with Zod, execute parameterized SQL queries in SQLite or PostgreSQL, commit the transaction, and return a 201 Created JSON response. The client intercepts the response, updates local state, and renders confirmation UI.",
        hint: "Trace network, reverse proxy, backend middlewares, database, and client state reaction."
      },
      {
        question: "How do you implement optimistic UI updates, and what happens when the backend request fails?",
        keyConcepts: ["instant feedback", "rollback mechanism", "React Query/SWR", "temporary IDs", "error toast"],
        idealAnswer: "Optimistic UI immediately reflects user actions in the interface before the server acknowledges them, delivering a perception of zero latency. In React Query, when an action is fired (like bookmarking a job), onMutate cancels outgoing queries, snapshots the previous cache state, and updates the cache with a temporary ID. If the API returns success, the temporary ID is replaced with the server response. If the request fails, onError rolls back the cache to the saved snapshot and displays a user-friendly error toast with a retry button.",
        hint: "Detail snapshotting previous state, optimistic mutation, and graceful rollback."
      }
    ],
    'System Design': [
      {
        question: "Design an end-to-end Real-Time Collaborative Document Editor like Google Docs or Notion.",
        keyConcepts: ["Operational Transformation (OT) vs CRDTs", "WebSockets", "conflict resolution", "presence awareness", "snapshotting"],
        idealAnswer: "A collaborative editor requires bidirectional real-time communication via WebSockets. To handle concurrent edits without conflicts, we use Conflict-free Replicated Data Types (CRDTs) like Yjs or Automerge. Edits are applied locally and broadcast to peers. The backend acts as a coordination server that persists document change logs, manages cursor presence awareness, and periodically snapshots document state to cold storage (S3/PostgreSQL).",
        hint: "Discuss WebSockets, CRDTs/OT for conflicts, and document snapshotting."
      }
    ],
    'Behavioral': [
      {
        question: "Tell me about a time you had to deliver a full-stack MVP under a tight deadline. What did you compromise on, and what was non-negotiable?",
        keyConcepts: ["scope management", "security non-negotiables", "MVP definition", "pragmatic trade-offs"],
        idealAnswer: "When launching our core applicant tracking module under a 3-week deadline, we prioritized essential user flows: search, view details, apply, and status tracking. Non-negotiables were security (JWT auth, parameterized queries, HTTPS, rate limits) and database integrity. We compromised on custom automated email digests and advanced animations, shipping them in subsequent sprint iterations once product-market fit was established.",
        hint: "Clearly separate security/data integrity from negotiable nice-to-have features."
      }
    ],
    'HR': [
      {
        question: "How do you stay current with rapidly evolving frontend and backend technologies?",
        keyConcepts: ["open-source exploration", "tech blogs", "building side projects", "RFCs", "community engagement"],
        idealAnswer: "I stay up to date by following official framework RFCs, reading engineering blogs from companies like Stripe, Figma, and Netflix, and building small, focused proof-of-concept projects to test new libraries firsthand. This helps me distinguish hype from genuine architectural improvements.",
        hint: "Mention hands-on practice, engineering blogs, and distinguishing hype from utility."
      }
    ]
  }
};

// Fallback questions for any role not explicitly mapped
const DEFAULT_QUESTIONS = [
  {
    question: "Walk me through your most impactful recent software project. What technical challenges did you overcome?",
    keyConcepts: ["architecture", "scale", "performance", "problem-solving", "measurable results"],
    idealAnswer: "In my recent project, I designed and implemented an end-to-end feature that significantly improved system efficiency. I resolved bottlenecks by optimizing database queries and introducing caching, resulting in a 40% reduction in response time and seamless scaling.",
    hint: "Structure your response with problem, technical solution, and measurable business impact."
  },
  {
    question: "How do you approach debugging a complex, intermittent issue in production that cannot be reproduced locally?",
    keyConcepts: ["logging", "telemetry", "distributed tracing", "reproducing with production data shapes", "hypothesis testing"],
    idealAnswer: "I begin by checking APM logs and distributed traces (Datadog/Sentry) around the time of the failure to identify patterns in request payloads or user states. I review recent deployments, isolate variables, form testable hypotheses, and add structured debug logs if necessary before implementing a verified fix.",
    hint: "Focus on telemetry, structured logs, and scientific hypothesis testing."
  },
  {
    question: "How do you balance writing comprehensive automated tests with delivering product features rapidly?",
    keyConcepts: ["test pyramid", "unit vs integration vs e2e", "critical path testing", "CI/CD automation"],
    idealAnswer: "I follow the testing pyramid: heavy coverage on business-critical unit logic and API integration contracts, with a focused set of end-to-end tests for primary user journeys. This maximizes safety while keeping test execution fast.",
    hint: "Mention test ROI, prioritizing the critical path, and automated CI pipelines."
  },
  {
    question: "Tell me about a time you received critical feedback on your code or design. How did you handle it?",
    keyConcepts: ["growth mindset", "receptiveness", "constructive action", "continuous improvement"],
    idealAnswer: "During an architectural review, a principal engineer pointed out that my proposed solution introduced unnecessary state duplication. I thanked them for the insight, studied their recommended pattern, refactored the design to be cleaner, and documented the rationale in our internal guidelines.",
    hint: "Show openness to learning and turning feedback into a technical improvement."
  },
  {
    question: "Where do you see yourself technically and professionally in the next 2-3 years?",
    keyConcepts: ["technical depth", "mentorship", "system architecture", "ownership", "business impact"],
    idealAnswer: "Over the next 2-3 years, I aim to deepen my expertise in distributed architectures and high-performance UI engineering, while taking on greater technical ownership and mentoring junior engineers.",
    hint: "Combine personal skill growth with leadership and organizational value."
  }
];

// 1. POST /api/interviews/generate - Generate 5 tailored questions
router.post('/generate', (req, res) => {
  try {
    const { role = 'frontend-developer', role_title = 'Frontend Developer', interview_type = 'Technical', experience_level = 'Mid' } = req.body;

    const roleQuestions = QUESTION_BANK[role] || QUESTION_BANK['full-stack-developer'] || {};
    let questionsPool = roleQuestions[interview_type] || [];

    // If pool is small, supplement with general questions from role
    if (questionsPool.length < 5) {
      Object.keys(roleQuestions).forEach(cat => {
        if (cat !== interview_type) {
          questionsPool = questionsPool.concat(roleQuestions[cat]);
        }
      });
    }

    // If still less than 5, supplement with default questions
    if (questionsPool.length < 5) {
      questionsPool = questionsPool.concat(DEFAULT_QUESTIONS);
    }

    // Select 5 distinct questions
    const selected = questionsPool.slice(0, 5).map((q, idx) => ({
      id: idx + 1,
      question: q.question,
      keyConcepts: q.keyConcepts || [],
      hint: q.hint || '',
      idealAnswer: q.idealAnswer || ''
    }));

    res.json({
      success: true,
      role,
      role_title,
      interview_type,
      experience_level,
      questions: selected
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. POST /api/interviews/evaluate-answer - Evaluate single answer
router.post('/evaluate-answer', (req, res) => {
  try {
    const { question, userAnswer = '', keyConcepts = [], idealAnswer = '' } = req.body;

    const trimmed = userAnswer.trim();
    const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

    if (wordCount < 5) {
      return res.json({
        success: true,
        score: 30,
        strengths: ["Attempted to respond."],
        improvements: ["Answer is too brief. Provide more technical context, examples, and detailed explanations."],
        matchedConcepts: [],
        missingConcepts: keyConcepts,
        feedback: "Your answer was too concise for a technical interview. Try elaborating on the core concepts and trade-offs."
      });
    }

    // Keyword matching
    const lowerAnswer = trimmed.toLowerCase();
    const matchedConcepts = keyConcepts.filter(kc => lowerAnswer.includes(kc.toLowerCase()));
    const missingConcepts = keyConcepts.filter(kc => !lowerAnswer.includes(kc.toLowerCase()));

    // Score calculation
    let baseScore = 60;
    if (wordCount > 30) baseScore += 10;
    if (wordCount > 70) baseScore += 10;
    if (keyConcepts.length > 0) {
      const matchRatio = matchedConcepts.length / keyConcepts.length;
      baseScore += Math.round(matchRatio * 20);
    }

    const finalScore = Math.min(Math.max(baseScore, 45), 98);

    const strengths = [];
    if (matchedConcepts.length > 0) {
      strengths.push(`Mentioned core terminology: ${matchedConcepts.slice(0, 3).join(', ')}.`);
    }
    if (wordCount > 50) {
      strengths.push("Good depth and explanation of technical context.");
    } else {
      strengths.push("Clear and direct response.");
    }

    const improvements = [];
    if (missingConcepts.length > 0) {
      improvements.push(`Consider discussing: ${missingConcepts.slice(0, 3).join(', ')}.`);
    }
    if (wordCount < 40) {
      improvements.push("Elaborate on real-world examples or architectural trade-offs to demonstrate senior depth.");
    }

    res.json({
      success: true,
      score: finalScore,
      strengths,
      improvements,
      matchedConcepts,
      missingConcepts,
      idealAnswer
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. POST /api/interviews/save - Save completed mock interview session
router.post('/save', (req, res) => {
  try {
    const userId = req.user.id;
    const {
      role,
      role_title,
      interview_type,
      experience_level,
      job_description = '',
      overall_score = 0,
      technical_score = 0,
      communication_score = 0,
      problem_solving_score = 0,
      confidence_score = 0,
      questions = [],
      summary_feedback = ''
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO mock_interviews (
        user_id, role, role_title, interview_type, experience_level,
        job_description, overall_score, technical_score, communication_score,
        problem_solving_score, confidence_score, questions_json, summary_feedback, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    const result = stmt.run(
      userId,
      role || 'general',
      role_title || 'Software Engineer',
      interview_type || 'Technical',
      experience_level || 'Mid',
      job_description,
      overall_score,
      technical_score,
      communication_score,
      problem_solving_score,
      confidence_score,
      JSON.stringify(questions),
      summary_feedback
    );

    res.status(201).json({
      success: true,
      message: 'Mock interview session saved successfully.',
      interview_id: result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. GET /api/interviews/history - Get user's past mock interview sessions
router.get('/history', (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = db.prepare(`
      SELECT 
        id, role, role_title, interview_type, experience_level,
        overall_score, technical_score, communication_score, problem_solving_score, confidence_score,
        summary_feedback, created_at
      FROM mock_interviews
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 20
    `).all(userId);

    res.json({
      success: true,
      sessions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. GET /api/interviews/:id - Get specific interview session details
router.get('/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const interviewId = parseInt(req.params.id, 10);

    const session = db.prepare(`
      SELECT * FROM mock_interviews WHERE id = ? AND user_id = ?
    `).get(interviewId, userId);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    try {
      session.questions = JSON.parse(session.questions_json);
    } catch (e) {
      session.questions = [];
    }

    res.json({
      success: true,
      session
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
