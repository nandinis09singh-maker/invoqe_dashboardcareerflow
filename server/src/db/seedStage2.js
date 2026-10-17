const db = require('./database');

const ROLES_DATA = [
  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Build performant, accessible, and responsive user interfaces with modern React, TypeScript, and modern web architectures.',
    icon: 'Layout',
    salary_data: [
      { level: 'Entry Level', experience: '0-2 yrs', min: 6, max: 12, avg: 8.5 },
      { level: 'Mid Level', experience: '2-5 yrs', min: 14, max: 24, avg: 18 },
      { level: 'Senior Level', experience: '5-8 yrs', min: 25, max: 42, avg: 32 },
      { level: 'Lead / Staff', experience: '8+ yrs', min: 45, max: 70, avg: 55 }
    ],
    stages: [
      {
        stage_order: 1,
        name: 'Beginner',
        description: 'Master core web fundamentals: structure, styling, programming basics, and version control.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'Personal Developer Portfolio',
            description: 'Responsive, accessible single-page portfolio with semantic HTML5, CSS Flexbox/Grid, and interactive mobile drawer.',
            key_features: ['Semantic markup', 'CSS Grid layouts', 'Dark mode toggle', 'Keyboard navigable contact form']
          },
          {
            title: 'Interactive Quiz Web App',
            description: 'Vanilla JavaScript quiz engine with timer, score tracking, dynamic DOM rendering, and localStorage persistence.',
            key_features: ['DOM manipulation', 'Timer intervals', 'Local storage persistence', 'Score calculation']
          }
        ],
        resources: [
          { title: 'MDN Web Docs - HTML, CSS & JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Learn', type: 'documentation', provider: 'Mozilla' },
          { title: 'freeCodeCamp Responsive Web Design Certification', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'course', provider: 'freeCodeCamp' },
          { title: 'JavaScript.info - The Modern JavaScript Tutorial', url: 'https://javascript.info/', type: 'interactive', provider: 'JavaScript.info' },
          { title: 'roadmap.sh - Frontend Developer Guide', url: 'https://roadmap.sh/frontend', type: 'roadmap', provider: 'roadmap.sh' }
        ],
        skills: [
          { name: 'HTML5 Semantics', description: 'Using proper semantic elements (header, main, nav, article) for accessibility and SEO.', category: 'Fundamentals', importance: 'Essential' },
          { name: 'CSS3 Flexbox & Grid', description: 'Modern two-dimensional and one-dimensional layout systems for responsive design.', category: 'Styling', importance: 'Essential' },
          { name: 'JavaScript Fundamentals', description: 'Variables, closures, scope, array methods (map, filter, reduce), and ES6+ syntax.', category: 'Programming', importance: 'Essential' },
          { name: 'DOM Manipulation & Events', description: 'Selecting elements, handling user events, bubbling, and dynamic DOM rendering.', category: 'Browser APIs', importance: 'Essential' },
          { name: 'Asynchronous JavaScript', description: 'Promises, async/await, Fetch API, and handling HTTP errors gracefully.', category: 'Programming', importance: 'Essential' },
          { name: 'Git & GitHub', description: 'Version control basics, branching, commits, pull requests, and merge conflict resolution.', category: 'Tooling', importance: 'Essential' },
          { name: 'Responsive Design & Mobile-First', description: 'Media queries, responsive typography with clamp(), and fluid layouts.', category: 'Styling', importance: 'Essential' },
          { name: 'Web Accessibility (a11y) Basics', description: 'ARIA labels, color contrast ratios, focus visible states, and screen reader testing.', category: 'Accessibility', importance: 'Recommended' }
        ]
      },
      {
        stage_order: 2,
        name: 'Intermediate',
        description: 'Build complex single-page applications with React, TypeScript, and modern styling libraries.',
        estimated_time: '6-8 weeks',
        project_ideas: [
          {
            title: 'E-Commerce Storefront with Cart',
            description: 'Full-featured shopping experience with category filtering, debounced search, modal previews, and cart drawer.',
            key_features: ['Zustand state store', 'Debounced search', 'Optimistic UI updates', 'Stripe mock checkout']
          },
          {
            title: 'Kanban Task Manager',
            description: 'Trello clone with drag-and-drop columns, task filtering, tags, and persistent browser storage.',
            key_features: ['HTML5 Drag and Drop', 'Custom hooks', 'Tailwind styling', 'Local storage sync']
          }
        ],
        resources: [
          { title: 'React Official Documentation (react.dev)', url: 'https://react.dev/learn', type: 'documentation', provider: 'React Team' },
          { title: 'TypeScript for JavaScript Programmers', url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html', type: 'documentation', provider: 'Microsoft' },
          { title: 'Tailwind CSS Official Walkthrough', url: 'https://tailwindcss.com/docs/utility-first', type: 'documentation', provider: 'Tailwind Labs' },
          { title: 'Fullstack Open - Modern React', url: 'https://fullstackopen.com/en/', type: 'course', provider: 'University of Helsinki' }
        ],
        skills: [
          { name: 'React Components & JSX', description: 'Functional components, props destructuring, conditional rendering, and children patterns.', category: 'React', importance: 'Essential' },
          { name: 'React Hooks Mastery', description: 'Deep knowledge of useState, useEffect, useCallback, useMemo, useRef, and custom hooks.', category: 'React', importance: 'Essential' },
          { name: 'TypeScript with React', description: 'Typing props, state, event handlers, generics, and strict TypeScript configurations.', category: 'TypeScript', importance: 'Essential' },
          { name: 'State Management (Zustand/Redux)', description: 'Global client state, middleware, selectors, and devtools debugging.', category: 'Architecture', importance: 'Essential' },
          { name: 'Tailwind CSS', description: 'Utility-first styling, design tokens, dark mode variants, and responsive breakpoints.', category: 'Styling', importance: 'Essential' },
          { name: 'REST API & Axios Integration', description: 'API client instances, interceptors, authentication bearer tokens, and error handlers.', category: 'Networking', importance: 'Essential' },
          { name: 'Modern Build Tooling (Vite)', description: 'Fast module replacement, bundle configuration, environment variables, and minification.', category: 'Tooling', importance: 'Recommended' },
          { name: 'React Router v6+', description: 'Nested layouts, protected route wrappers, dynamic URL parameters, and query strings.', category: 'React', importance: 'Essential' }
        ]
      },
      {
        stage_order: 3,
        name: 'Advanced',
        description: 'Server components, web performance optimization, automated testing, and secure frontend architectures.',
        estimated_time: '8-10 weeks',
        project_ideas: [
          {
            title: 'Full-Stack Next.js 14 App with SSR',
            description: 'Server-side rendered blog or content platform with server actions, incremental static regeneration, and SEO meta tags.',
            key_features: ['Server components', 'Dynamic metadata', 'Image optimization', 'Server actions']
          },
          {
            title: 'Real-Time Collaborative Whiteboard',
            description: 'Canvas drawing board with multi-cursor presence, WebSocket broadcasting, and undo/redo history.',
            key_features: ['HTML5 Canvas API', 'WebSockets', 'Operational transforms / CRDT basics', 'State snapshots']
          }
        ],
        resources: [
          { title: 'Next.js App Router Documentation', url: 'https://nextjs.org/docs', type: 'documentation', provider: 'Vercel' },
          { title: 'Web.dev Performance & Core Web Vitals', url: 'https://web.dev/learn/performance', type: 'documentation', provider: 'Google Chrome Team' },
          { title: 'Testing JavaScript with Vitest & Testing Library', url: 'https://testing-library.com/docs/react-testing-library/intro/', type: 'documentation', provider: 'Kent C. Dodds' },
          { title: 'OWASP Frontend Security Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/', type: 'documentation', provider: 'OWASP' }
        ],
        skills: [
          { name: 'Next.js & Server Components', description: 'App Router, streaming SSR, Server Actions, route handlers, and static optimization.', category: 'Frameworks', importance: 'Essential' },
          { name: 'Core Web Vitals & Performance', description: 'LCP, FID/INP, CLS optimization, code splitting, dynamic imports, and bundle analysis.', category: 'Performance', importance: 'Essential' },
          { name: 'Automated Testing (Vitest & RTL)', description: 'Unit testing components, mocking API requests, integration tests, and user event simulation.', category: 'Testing', importance: 'Essential' },
          { name: 'Frontend Security (XSS, CSRF, CSP)', description: 'Sanitizing input, httpOnly cookies, Content Security Policy headers, and token security.', category: 'Security', importance: 'Essential' },
          { name: 'Progressive Web Apps (PWA)', description: 'Service workers, offline caching strategies, web app manifest, and push notifications.', category: 'Browser APIs', importance: 'Recommended' },
          { name: 'CI/CD Automation for Frontend', description: 'GitHub Actions workflows for automated linting, test suites, and staging deployments.', category: 'DevOps', importance: 'Recommended' },
          { name: 'Advanced Animation (Framer Motion)', description: 'Layout animations, gesture controls, exit animations, and physics-based spring transitions.', category: 'UI/UX', importance: 'Recommended' }
        ]
      },
      {
        stage_order: 4,
        name: 'Job-ready',
        description: 'Scalable frontend system design, micro-frontends, component design systems, and technical interview mastery.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'Enterprise Design System Library',
            description: 'Publishable NPM component library documented in Storybook with full WCAG AA accessibility tests.',
            key_features: ['Storybook interactive docs', 'NPM packaging', 'Semantic versioning', 'Automated visual regression']
          },
          {
            title: 'Production SaaS Analytics Dashboard',
            description: 'High-density metrics dashboard with interactive charts, real-time telemetry alerts, and CSV/PDF report exports.',
            key_features: ['Recharts data visualization', 'Virtual scrolling for 10k+ rows', 'Role-based access', 'Export engine']
          }
        ],
        resources: [
          { title: 'Front End System Design Handbook', url: 'https://www.greatfrontend.com/system-design', type: 'guide', provider: 'GreatFrontend' },
          { title: 'Storybook Component Driven UI', url: 'https://storybook.js.org/tutorials/intro-to-storybook/', type: 'tutorial', provider: 'Storybook' },
          { title: '30 Days of React Coding Challenges', url: 'https://leetcode.com/explore/interview/card/top-interview-questions-easy/', type: 'interactive', provider: 'LeetCode' }
        ],
        skills: [
          { name: 'Frontend System Design', description: 'Designing high-scale web platforms (e.g. newsfeeds, chat, collaborative editors, checkout).', category: 'Architecture', importance: 'Essential' },
          { name: 'Design Systems & Storybook', description: 'Tokens, atomic design, accessible components, visual regression testing, and docs.', category: 'Architecture', importance: 'Essential' },
          { name: 'Micro-Frontends Architecture', description: 'Module Federation, iframe sandboxing, independent deployments, and shared dependencies.', category: 'Architecture', importance: 'Recommended' },
          { name: 'Production Observability (Sentry, OpenTelemetry)', description: 'Error tracking, performance tracing, user session replays, and real user monitoring (RUM).', category: 'Observability', importance: 'Essential' },
          { name: 'Technical Interview Problem Solving', description: 'JavaScript data structures, algorithms, DOM traversal, and live coding exercises.', category: 'Interviews', importance: 'Essential' }
        ]
      }
    ]
  },
  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    description: 'Architect scalable RESTful & GraphQL APIs, microservices, database schemas, and robust server-side distributed systems.',
    icon: 'Server',
    salary_data: [
      { level: 'Entry Level', experience: '0-2 yrs', min: 7, max: 14, avg: 10 },
      { level: 'Mid Level', experience: '2-5 yrs', min: 16, max: 28, avg: 22 },
      { level: 'Senior Level', experience: '5-8 yrs', min: 28, max: 48, avg: 38 },
      { level: 'Lead / Staff', experience: '8+ yrs', min: 50, max: 80, avg: 62 }
    ],
    stages: [
      {
        stage_order: 1,
        name: 'Beginner',
        description: 'Server fundamentals, runtime environments, HTTP protocols, and version control.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'CLI Task & Note Tracker',
            description: 'Command line tool with file-based persistence, arguments parsing, and formatted output tables.',
            key_features: ['File system I/O', 'Argument parsing', 'JSON serialization', 'Error handling']
          },
          {
            title: 'Static File HTTP Server',
            description: 'Custom HTTP server built with Node.js built-in modules that serves assets and handles MIME types.',
            key_features: ['HTTP status codes', 'Stream piping', 'MIME type resolution', 'Request routing']
          }
        ],
        resources: [
          { title: 'Node.js Official Documentation & Guides', url: 'https://nodejs.org/en/learn', type: 'documentation', provider: 'OpenJS Foundation' },
          { title: 'MDN - Overview of HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', type: 'documentation', provider: 'Mozilla' },
          { title: 'Linux Command Line Basics', url: 'https://ubuntu.com/tutorials/command-line-for-beginners', type: 'tutorial', provider: 'Canonical' }
        ],
        skills: [
          { name: 'Node.js Core & Event Loop', description: 'Non-blocking I/O, event loop phases, process memory, and global objects.', category: 'Runtime', importance: 'Essential' },
          { name: 'HTTP/HTTPS Protocol', description: 'Methods, status codes, headers, cookies, TLS/SSL encryption, and REST principles.', category: 'Networking', importance: 'Essential' },
          { name: 'Linux CLI & Shell Basics', description: 'File navigation, bash scripting, permissions, process management, and curl.', category: 'Operations', importance: 'Essential' },
          { name: 'NPM & Package Management', description: 'Managing dependencies, package.json scripts, lockfiles, and semver.', category: 'Tooling', importance: 'Essential' },
          { name: 'Streams & Buffer Management', description: 'Handling large files with readable/writable streams without memory leaks.', category: 'Runtime', importance: 'Recommended' },
          { name: 'Basic SQL & Database Concepts', description: 'CRUD operations, SELECT statements, WHERE filters, and basic joins.', category: 'Databases', importance: 'Essential' }
        ]
      },
      {
        stage_order: 2,
        name: 'Intermediate',
        description: 'Express APIs, relational databases, authentication, and Docker containerization.',
        estimated_time: '6-8 weeks',
        project_ideas: [
          {
            title: 'RESTful E-Commerce Backend API',
            description: 'Complete API with user auth, product catalog, search filters, shopping cart, and order placement.',
            key_features: ['JWT auth cookies', 'PostgreSQL relations', 'Transactions', 'Validation with Zod/Joi']
          },
          {
            title: 'Secure File Vault API with Multer',
            description: 'Cloud storage API with file validation, size limits, streaming uploads, and signed download URLs.',
            key_features: ['Multer validation', 'Stream hashing', 'AWS S3 integration', 'Rate limiting']
          }
        ],
        resources: [
          { title: 'Express.js Guide', url: 'https://expressjs.com/en/guide/routing.html', type: 'documentation', provider: 'Express' },
          { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', type: 'tutorial', provider: 'PostgreSQL Tutorial' },
          { title: 'Docker for Developers', url: 'https://docs.docker.com/get-started/', type: 'documentation', provider: 'Docker' }
        ],
        skills: [
          { name: 'Express.js Framework', description: 'Middleware chaining, routing, error handling middleware, and request validation.', category: 'Frameworks', importance: 'Essential' },
          { name: 'PostgreSQL & Schema Design', description: 'Indexes, foreign keys, constraints, table normalization, and ACID transactions.', category: 'Databases', importance: 'Essential' },
          { name: 'JWT & Session Authentication', description: 'httpOnly cookies, token refresh rotation, bcrypt password hashing, and CSRF protection.', category: 'Security', importance: 'Essential' },
          { name: 'Docker Containerization', description: 'Writing Dockerfiles, multi-stage builds, docker-compose for multi-service local environments.', category: 'DevOps', importance: 'Essential' },
          { name: 'Input Validation & Sanitization', description: 'Schema validation using Zod, Joi, or express-validator to prevent injection.', category: 'Security', importance: 'Essential' },
          { name: 'API Rate Limiting & Helmet', description: 'Protecting against brute force, DDoS mitigation, and setting secure HTTP headers.', category: 'Security', importance: 'Essential' },
          { name: 'Database Query Optimization', description: 'EXPLAIN ANALYZE, indexing strategies (B-Tree, GIN), and N+1 query resolution.', category: 'Databases', importance: 'Recommended' }
        ]
      },
      {
        stage_order: 3,
        name: 'Advanced',
        description: 'Distributed architectures, caching, message queues, and microservices.',
        estimated_time: '8-10 weeks',
        project_ideas: [
          {
            title: 'High-Throughput Order Queue System',
            description: 'Order processing pipeline with RabbitMQ / Kafka, Redis idempotency cache, and worker consumer pods.',
            key_features: ['Message queue consumers', 'Dead letter queues', 'Redis caching', 'Distributed locks']
          },
          {
            title: 'Real-Time Notification Hub',
            description: 'Multi-tenant notification gateway supporting WebSockets, Push notifications, and email batches.',
            key_features: ['Socket.io clustering', 'Redis pub/sub', 'Template rendering', 'Delivery retries']
          }
        ],
        resources: [
          { title: 'Redis University & Documentation', url: 'https://redis.io/docs/', type: 'documentation', provider: 'Redis' },
          { title: 'Apache Kafka Quickstart', url: 'https://kafka.apache.org/quickstart', type: 'documentation', provider: 'Apache' },
          { title: 'Designing Data-Intensive Applications Guide', url: 'https://dataintensive.net/', type: 'book', provider: 'Martin Kleppmann' }
        ],
        skills: [
          { name: 'Redis Caching & In-Memory Data', description: 'Cache-aside pattern, TTL expiration, Redis data structures, and pub/sub.', category: 'Performance', importance: 'Essential' },
          { name: 'Message Brokers (Kafka / RabbitMQ)', description: 'Asynchronous event streaming, consumer groups, message acknowledgements, and dead letter queues.', category: 'Architecture', importance: 'Essential' },
          { name: 'Microservices Communication (gRPC & REST)', description: 'Service-to-service RPC, protobuf serialization, service discovery, and circuit breakers.', category: 'Architecture', importance: 'Essential' },
          { name: 'GraphQL API Design', description: 'Schemas, type definitions, resolvers, DataLoader for batching, and query complexity limits.', category: 'APIs', importance: 'Recommended' },
          { name: 'Distributed Transactions & Sagas', description: 'Handling multi-service transactions with Saga choreography and compensation events.', category: 'Architecture', importance: 'Recommended' },
          { name: 'Unit & Integration Testing (Jest/Supertest)', description: 'Testing API endpoints, mock databases, test containers, and CI pipelines.', category: 'Testing', importance: 'Essential' }
        ]
      },
      {
        stage_order: 4,
        name: 'Job-ready',
        description: 'High-scale system design, monitoring, reliability engineering, and backend interview mastery.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'Distributed URL Shortener (Bitly Scale)',
            description: 'Scales to 100M+ requests with distributed ID generation (Snowflake), Redis cluster caching, and analytics.',
            key_features: ['Distributed unique ID generator', 'Base62 encoding', 'Redis caching', 'Analytics aggregation']
          },
          {
            title: 'Fault-Tolerant Payment Gateway Orchestrator',
            description: 'Payment routing gateway with automatic failover across 3 providers, idempotency keys, and reconciliation.',
            key_features: ['Idempotency keys', 'Webhook verification', 'Reconciliation cron', 'Provider failover']
          }
        ],
        resources: [
          { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'guide', provider: 'Donne Martin' },
          { title: 'Prometheus Monitoring Essentials', url: 'https://prometheus.io/docs/introduction/overview/', type: 'documentation', provider: 'Prometheus' }
        ],
        skills: [
          { name: 'Backend System Design', description: 'Designing systems like Uber dispatch, WhatsApp chat, Netflix video processing, and payment processing.', category: 'Architecture', importance: 'Essential' },
          { name: 'Observability (Prometheus, Grafana, OpenTelemetry)', description: 'Metrics collection (RED method), distributed tracing, structured logging, and alerting rules.', category: 'DevOps', importance: 'Essential' },
          { name: 'Database Sharding & Replication', description: 'Read replicas, write masters, connection pooling (PgBouncer), and partition strategies.', category: 'Databases', importance: 'Essential' },
          { name: 'Idempotency & Concurrency Control', description: 'Pessimistic vs optimistic locking, distributed mutexes with Redis, and idempotent API designs.', category: 'Architecture', importance: 'Essential' },
          { name: 'Backend Technical Interview Mastery', description: 'System design interviews, live SQL queries, database indexing questions, and algorithmic concurrency.', category: 'Interviews', importance: 'Essential' }
        ]
      }
    ]
  },
  {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer',
    description: 'Bridge frontend interactivity with robust backend microservices, database design, and automated cloud deployments.',
    icon: 'Layers',
    salary_data: [
      { level: 'Entry Level', experience: '0-2 yrs', min: 7, max: 14, avg: 10 },
      { level: 'Mid Level', experience: '2-5 yrs', min: 16, max: 30, avg: 22 },
      { level: 'Senior Level', experience: '5-8 yrs', min: 30, max: 52, avg: 40 },
      { level: 'Lead / Staff', experience: '8+ yrs', min: 55, max: 85, avg: 68 }
    ],
    stages: [
      {
        stage_order: 1,
        name: 'Beginner',
        description: 'End-to-end web fundamentals: HTML, CSS, JavaScript, basic Node.js, and relational databases.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'Full-Stack CRUD Notes App',
            description: 'Vanilla frontend communicating with an Express and SQLite backend with full create, read, update, and delete.',
            key_features: ['REST API endpoints', 'SQL queries', 'Interactive UI', 'Form validation']
          }
        ],
        resources: [
          { title: 'The Odin Project - Full Stack JavaScript', url: 'https://www.theodinproject.com/', type: 'course', provider: 'The Odin Project' },
          { title: 'Full Stack Open - University of Helsinki', url: 'https://fullstackopen.com/en/', type: 'course', provider: 'University of Helsinki' }
        ],
        skills: [
          { name: 'HTML5 & Modern CSS3', description: 'Clean document semantics and responsive layouts.', category: 'Frontend', importance: 'Essential' },
          { name: 'JavaScript & ES6+ Syntax', description: 'Async/await, destructuring, promises, and modules.', category: 'Core', importance: 'Essential' },
          { name: 'Node.js & Express Basics', description: 'Setting up routes, request parsing, and error middleware.', category: 'Backend', importance: 'Essential' },
          { name: 'Relational Database Basics (SQLite/PostgreSQL)', description: 'Creating tables, foreign keys, and writing SQL queries.', category: 'Databases', importance: 'Essential' },
          { name: 'Git Branching & Pull Requests', description: 'Collaborative development workflow and code hygiene.', category: 'Tooling', importance: 'Essential' }
        ]
      },
      {
        stage_order: 2,
        name: 'Intermediate',
        description: 'React SPA connected to authenticated REST APIs with token cookies and ORMs/query builders.',
        estimated_time: '6-8 weeks',
        project_ideas: [
          {
            title: 'Multi-Tenant Project Management Tool',
            description: 'SaaS workspace with user authentication, team invites, task boards, and activity logs.',
            key_features: ['JWT cookie auth', 'Relational data modeling', 'React state store', 'Tailwind CSS']
          }
        ],
        resources: [
          { title: 'React Documentation', url: 'https://react.dev/', type: 'documentation', provider: 'React' },
          { title: 'Prisma / Knex Documentation', url: 'https://www.prisma.io/docs', type: 'documentation', provider: 'Prisma' }
        ],
        skills: [
          { name: 'React & Modern State Management', description: 'Hooks, context, and client state libraries (Zustand).', category: 'Frontend', importance: 'Essential' },
          { name: 'TypeScript across Stack', description: 'Sharing types between frontend and backend contracts.', category: 'Core', importance: 'Essential' },
          { name: 'JWT & Cookie Authentication', description: 'httpOnly cookies, token verification, and role-based permissions.', category: 'Security', importance: 'Essential' },
          { name: 'PostgreSQL & ORMs (Prisma / Drizzle)', description: 'Schema migrations, relation querying, and data seeding.', category: 'Databases', importance: 'Essential' },
          { name: 'Tailwind CSS UI Component Systems', description: 'Building accessible, reusable design systems.', category: 'Frontend', importance: 'Essential' }
        ]
      },
      {
        stage_order: 3,
        name: 'Advanced',
        description: 'Next.js full-stack architectures, background workers, caching, and cloud deployments.',
        estimated_time: '8-10 weeks',
        project_ideas: [
          {
            title: 'Real-Time Job Board & Application Platform (CareerFlow)',
            description: 'Complete recruitment platform with search filters, drag-and-drop Kanban, resume builder, and analytics.',
            key_features: ['Kanban drag-and-drop', 'Resume PDF generation', 'Full text search', 'Docker packaging']
          }
        ],
        resources: [
          { title: 'Next.js Full Stack Guides', url: 'https://nextjs.org/docs', type: 'documentation', provider: 'Vercel' },
          { title: 'Docker Complete Guide', url: 'https://docs.docker.com/', type: 'documentation', provider: 'Docker' }
        ],
        skills: [
          { name: 'Full-Stack Next.js (App Router)', description: 'Server components, server actions, and API routes.', category: 'Full-Stack', importance: 'Essential' },
          { name: 'Redis Caching & Session Stores', description: 'High-speed caching and rate-limiting middleware.', category: 'Performance', importance: 'Essential' },
          { name: 'Docker & Microservices Setup', description: 'Multi-container environments and docker-compose.', category: 'DevOps', importance: 'Essential' },
          { name: 'File Uploads & S3 Cloud Storage', description: 'Multer streams, presigned URLs, and virus scanning.', category: 'Storage', importance: 'Essential' },
          { name: 'End-to-End Testing (Playwright / Cypress)', description: 'Full browser automated tests simulating real candidate journeys.', category: 'Testing', importance: 'Recommended' }
        ]
      },
      {
        stage_order: 4,
        name: 'Job-ready',
        description: 'End-to-end system design, production resilience, CI/CD, and tech lead interview readiness.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'High-Scale Fintech SaaS Platform',
            description: 'Complete production platform with multi-currency billing, webhook processing, audit trails, and PDF statements.',
            key_features: ['Webhook verification', 'Automated reconciliation', 'PDF generator', 'Zero downtime deployment']
          }
        ],
        resources: [
          { title: 'System Design for Full-Stack Engineers', url: 'https://github.com/donnemartin/system-design-primer', type: 'guide', provider: 'Donne Martin' }
        ],
        skills: [
          { name: 'End-to-End System Design', description: 'Designing scalable web apps from CDN edge to database shards.', category: 'Architecture', importance: 'Essential' },
          { name: 'Cloud Deployments & CI/CD', description: 'Automated GitHub Actions pipelines deploying to AWS/Vercel/Render.', category: 'DevOps', importance: 'Essential' },
          { name: 'Performance Profiling & Bottlenecks', description: 'Identifying SQL bottlenecks, memory leaks, and render waterfalls.', category: 'Performance', importance: 'Essential' },
          { name: 'Technical Leadership & Architecture Reviews', description: 'RFC proposals, sprint estimation, and engineering mentorship.', category: 'Leadership', importance: 'Recommended' }
        ]
      }
    ]
  },
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    description: 'Transform raw datasets into actionable commercial intelligence with SQL, Python, Excel, and interactive dashboards.',
    icon: 'BarChart3',
    salary_data: [
      { level: 'Entry Level', experience: '0-2 yrs', min: 5, max: 10, avg: 7.5 },
      { level: 'Mid Level', experience: '2-5 yrs', min: 12, max: 20, avg: 15.5 },
      { level: 'Senior Level', experience: '5-8 yrs', min: 22, max: 35, avg: 28 },
      { level: 'Lead / Staff', experience: '8+ yrs', min: 38, max: 55, avg: 45 }
    ],
    stages: [
      {
        stage_order: 1,
        name: 'Beginner',
        description: 'Spreadsheet mastery, statistical fundamentals, and foundational SQL querying.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'Retail Sales Performance Analysis',
            description: 'Excel dashboard analyzing regional sales, profit margins, and inventory turnover using Pivot tables.',
            key_features: ['VLOOKUP / XLOOKUP', 'Pivot tables & slicers', 'Conditional formatting', 'Summary statistics']
          }
        ],
        resources: [
          { title: 'Excel for Data Analysis - Microsoft Learn', url: 'https://learn.microsoft.com/en-us/training/paths/modern-analytics-excel/', type: 'course', provider: 'Microsoft' },
          { title: 'Mode Analytics SQL Tutorial', url: 'https://mode.com/sql-tutorial/', type: 'interactive', provider: 'Mode' }
        ],
        skills: [
          { name: 'Advanced Excel & Google Sheets', description: 'XLOOKUP, INDEX/MATCH, Pivot Tables, and financial formulas.', category: 'Spreadsheets', importance: 'Essential' },
          { name: 'SQL Querying Basics', description: 'SELECT, WHERE, GROUP BY, HAVING, ORDER BY, and aggregate functions.', category: 'SQL', importance: 'Essential' },
          { name: 'Descriptive Statistics', description: 'Mean, median, mode, variance, standard deviation, and percentiles.', category: 'Mathematics', importance: 'Essential' },
          { name: 'Data Cleaning Fundamentals', description: 'Handling missing values, deduplication, and data type casting.', category: 'Data Quality', importance: 'Essential' }
        ]
      },
      {
        stage_order: 2,
        name: 'Intermediate',
        description: 'Python data science libraries (Pandas, NumPy) and business intelligence tools (Power BI, Tableau).',
        estimated_time: '6-8 weeks',
        project_ideas: [
          {
            title: 'Customer Churn & Retention Dashboard',
            description: 'Power BI report tracking monthly cohort retention, churn rates, and lifetime value drivers.',
            key_features: ['DAX calculations', 'Cohort charts', 'Interactive cross-filtering', 'LTV forecasting']
          }
        ],
        resources: [
          { title: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/', type: 'documentation', provider: 'PyData' },
          { title: 'Power BI Learning Path', url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi', type: 'course', provider: 'Microsoft' }
        ],
        skills: [
          { name: 'Python for Data Analysis (Pandas & NumPy)', description: 'DataFrames, merging, reshaping, grouping, and series manipulation.', category: 'Programming', importance: 'Essential' },
          { name: 'Power BI / Tableau Visualizations', description: 'Building interactive reports, DAX calculations, and data relationships.', category: 'BI Tools', importance: 'Essential' },
          { name: 'Intermediate SQL & Joins', description: 'INNER, LEFT, RIGHT, FULL OUTER joins, subqueries, and views.', category: 'SQL', importance: 'Essential' },
          { name: 'Exploratory Data Analysis (EDA)', description: 'Identifying correlations, outliers, and distribution shapes with Seaborn/Matplotlib.', category: 'Analysis', importance: 'Essential' }
        ]
      },
      {
        stage_order: 3,
        name: 'Advanced',
        description: 'Complex SQL window functions, cloud data warehouses, and experimental A/B testing.',
        estimated_time: '8-10 weeks',
        project_ideas: [
          {
            title: 'E-Commerce Product A/B Test Evaluation',
            description: 'Hypothesis testing analyzing checkout flow changes, statistical significance, and p-values.',
            key_features: ['T-test & Chi-square test', 'Confidence intervals', 'Power analysis', 'Executive summary']
          }
        ],
        resources: [
          { title: 'Google BigQuery Documentation', url: 'https://cloud.google.com/bigquery/docs', type: 'documentation', provider: 'Google Cloud' },
          { title: 'Statistical Methods for A/B Testing', url: 'https://www.coursera.org/', type: 'course', provider: 'Coursera' }
        ],
        skills: [
          { name: 'SQL Window Functions & CTEs', description: 'ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, running totals, and partition clauses.', category: 'SQL', importance: 'Essential' },
          { name: 'Data Warehousing (BigQuery / Snowflake)', description: 'Star schemas, dimension tables, fact tables, and columnar query optimization.', category: 'Warehousing', importance: 'Essential' },
          { name: 'A/B Testing & Hypothesis Testing', description: 'Null hypothesis, p-values, sample size determination, and statistical confidence.', category: 'Experimentation', importance: 'Essential' },
          { name: 'Data Modeling & ETL Pipelines', description: 'Building staging and mart layers using SQL/dbt.', category: 'Data Engineering', importance: 'Recommended' }
        ]
      },
      {
        stage_order: 4,
        name: 'Job-ready',
        description: 'Executive storytelling, stakeholder management, automated analytics delivery, and business acumen.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'Company Executive KPI Cockpit',
            description: 'End-to-end automated BI solution tracking ARR, customer acquisition cost (CAC), and payback periods.',
            key_features: ['Automated ETL refresh', 'Role-based security', 'Executive commentary', 'Anomaly alerts']
          }
        ],
        resources: [
          { title: 'Storytelling with Data', url: 'https://www.storytellingwithdata.com/', type: 'guide', provider: 'Cole Nussbaumer' }
        ],
        skills: [
          { name: 'Executive Data Storytelling', description: 'Translating complex metrics into non-technical stakeholder recommendations.', category: 'Communication', importance: 'Essential' },
          { name: 'Commercial SaaS & E-commerce Metrics', description: 'Understanding MRR, ARR, churn, LTV/CAC ratios, and net revenue retention (NRR).', category: 'Business', importance: 'Essential' },
          { name: 'dbt (Data Build Tool)', description: 'Version-controlled data transformations, documentation, and data testing.', category: 'Tooling', importance: 'Recommended' },
          { name: 'Data Analyst Portfolio & Case Study Defense', description: 'Presenting portfolio case studies, answering live SQL queries, and product metrics trade-offs.', category: 'Interviews', importance: 'Essential' }
        ]
      }
    ]
  },
  {
    slug: 'data-scientist',
    title: 'Data Scientist',
    description: 'Build predictive machine learning models, statistical experiments, and natural language / deep learning algorithms.',
    icon: 'Brain',
    salary_data: [
      { level: 'Entry Level', experience: '0-2 yrs', min: 8, max: 15, avg: 11.5 },
      { level: 'Mid Level', experience: '2-5 yrs', min: 18, max: 32, avg: 24 },
      { level: 'Senior Level', experience: '5-8 yrs', min: 32, max: 55, avg: 42 },
      { level: 'Lead / Staff', experience: '8+ yrs', min: 55, max: 90, avg: 72 }
    ],
    stages: [
      {
        stage_order: 1,
        name: 'Beginner',
        description: 'Mathematical foundations: linear algebra, multivariable calculus, probability, and scientific Python.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'Statistical Housing Price Analysis',
            description: 'Regression analysis analyzing feature correlations, distributions, and baseline price predictions.',
            key_features: ['Correlation matrix', 'Feature distribution plots', 'Outlier removal', 'Baseline linear model']
          }
        ],
        resources: [
          { title: 'Khan Academy - Linear Algebra & Statistics', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course', provider: 'Khan Academy' },
          { title: 'Python Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'book', provider: 'Jake VanderPlas' }
        ],
        skills: [
          { name: 'Linear Algebra & Matrix Operations', description: 'Vector spaces, matrix multiplication, eigenvalues, and eigenvectors.', category: 'Math', importance: 'Essential' },
          { name: 'Probability & Distributions', description: 'Bayes theorem, normal distributions, binomial distributions, and central limit theorem.', category: 'Math', importance: 'Essential' },
          { name: 'Scientific Python (NumPy & SciPy)', description: 'Array broadcasting, vectorization, and mathematical routines.', category: 'Programming', importance: 'Essential' },
          { name: 'Data Visualization (Matplotlib / Seaborn)', description: 'Scatter plots, histograms, pairplots, and heatmap visualizations.', category: 'Visualization', importance: 'Essential' }
        ]
      },
      {
        stage_order: 2,
        name: 'Intermediate',
        description: 'Supervised and unsupervised machine learning algorithms with Scikit-Learn.',
        estimated_time: '6-8 weeks',
        project_ideas: [
          {
            title: 'Credit Card Fraud Detection Classifier',
            description: 'Handling severe class imbalance using SMOTE and training XGBoost models to maximize precision-recall AUC.',
            key_features: ['SMOTE oversampling', 'Random Forests & XGBoost', 'Precision-Recall curves', 'Cross-validation']
          }
        ],
        resources: [
          { title: 'Scikit-Learn Machine Learning Guide', url: 'https://scikit-learn.org/stable/user_guide.html', type: 'documentation', provider: 'Scikit-Learn' },
          { title: 'Kaggle Learn - Machine Learning', url: 'https://www.kaggle.com/learn', type: 'interactive', provider: 'Kaggle' }
        ],
        skills: [
          { name: 'Supervised Learning (Regression & Classification)', description: 'Linear/Logistic regression, Decision Trees, Random Forests, and Gradient Boosting.', category: 'Machine Learning', importance: 'Essential' },
          { name: 'Unsupervised Learning (Clustering & PCA)', description: 'K-Means, DBSCAN, hierarchical clustering, and Principal Component Analysis.', category: 'Machine Learning', importance: 'Essential' },
          { name: 'Feature Engineering & Selection', description: 'Encoding categorical variables, polynomial features, scaling, and feature importance.', category: 'Data Preparation', importance: 'Essential' },
          { name: 'Model Evaluation & Metrics', description: 'ROC-AUC, Precision, Recall, F1-score, Confusion Matrix, and cross-validation strategies.', category: 'Machine Learning', importance: 'Essential' }
        ]
      },
      {
        stage_order: 3,
        name: 'Advanced',
        description: 'Deep learning architectures, neural networks with PyTorch, NLP, and modern LLMs.',
        estimated_time: '8-10 weeks',
        project_ideas: [
          {
            title: 'Customer Sentiment & Intent Classifier with HuggingFace',
            description: 'Fine-tuning a transformer model (BERT/RoBERTa) to classify incoming customer support tickets.',
            key_features: ['Tokenization', 'Hugging Face transformers', 'Fine-tuning weights', 'Inference latency benchmarking']
          }
        ],
        resources: [
          { title: 'DeepLearning.AI Deep Learning Specialization', url: 'https://www.deeplearning.ai/', type: 'course', provider: 'Andrew Ng' },
          { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course/', type: 'interactive', provider: 'Hugging Face' }
        ],
        skills: [
          { name: 'Deep Learning with PyTorch', description: 'Tensors, autograd, multi-layer perceptrons, backpropagation, and loss functions.', category: 'Deep Learning', importance: 'Essential' },
          { name: 'Natural Language Processing (NLP) & Transformers', description: 'Tokenization, embeddings, self-attention mechanism, and BERT architectures.', category: 'NLP', importance: 'Essential' },
          { name: 'LLM Fine-Tuning & Prompt Engineering', description: 'PEFT, LoRA, quantized models, and RAG (Retrieval-Augmented Generation) pipelines.', category: 'AI', importance: 'Recommended' },
          { name: 'Computer Vision Basics (CNNs)', description: 'Convolutional layers, pooling, transfer learning with ResNet, and object detection.', category: 'Vision', importance: 'Recommended' }
        ]
      },
      {
        stage_order: 4,
        name: 'Job-ready',
        description: 'MLOps, model serving APIs, monitoring data drift, and data science interview challenges.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'End-to-End ML Pipeline with FastAPI & MLflow',
            description: 'Deploy a containerized model API with continuous integration, drift monitoring, and batch inference.',
            key_features: ['FastAPI REST service', 'MLflow model registry', 'Data drift detection', 'Docker container']
          }
        ],
        resources: [
          { title: 'Made With ML - MLOps Course', url: 'https://madewithml.com/', type: 'course', provider: 'Goku Mohandas' },
          { title: 'Chip Huyen - Designing Machine Learning Systems', url: 'https://chiphuyen.com/', type: 'book', provider: 'Chip Huyen' }
        ],
        skills: [
          { name: 'MLOps & Model Serving (FastAPI, Docker)', description: 'Packaging models into low-latency REST endpoints with health checks.', category: 'MLOps', importance: 'Essential' },
          { name: 'Model Registry & Tracking (MLflow / Weights&Biases)', description: 'Experiment tracking, hyperparameter logging, and model artifact versioning.', category: 'MLOps', importance: 'Essential' },
          { name: 'Model Monitoring & Data Drift', description: 'Detecting covariate shift, concept drift, and automated retraining triggers.', category: 'MLOps', importance: 'Essential' },
          { name: 'Data Science Interview Preparation', description: 'Coding algorithms, statistical probability questions, and ML system design interviews.', category: 'Interviews', importance: 'Essential' }
        ]
      }
    ]
  },
  {
    slug: 'ui-ux-designer',
    title: 'UI/UX Designer',
    description: 'Craft intuitive user journeys, interactive design systems, wireframes, and high-fidelity clickable prototypes.',
    icon: 'Palette',
    salary_data: [
      { level: 'Entry Level', experience: '0-2 yrs', min: 5, max: 10, avg: 7.5 },
      { level: 'Mid Level', experience: '2-5 yrs', min: 12, max: 22, avg: 17 },
      { level: 'Senior Level', experience: '5-8 yrs', min: 24, max: 38, avg: 30 },
      { level: 'Lead / Staff', experience: '8+ yrs', min: 40, max: 65, avg: 50 }
    ],
    stages: [
      {
        stage_order: 1,
        name: 'Beginner',
        description: 'Visual design fundamentals: typography, color theory, spacing, and Figma basics.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'Mobile Banking App UI Redesign',
            description: 'High-fidelity redesign of 5 core screens with consistent typography, color palette, and component auto-layout.',
            key_features: ['8pt grid system', 'Typography scale', 'Color accessibility check', 'Auto-layout in Figma']
          }
        ],
        resources: [
          { title: 'Figma for Beginners Tutorial', url: 'https://www.figma.com/resource-library/', type: 'tutorial', provider: 'Figma' },
          { title: 'Refactoring UI Book by Adam Wathan & Steve Schoger', url: 'https://www.refactoringui.com/', type: 'book', provider: 'Tailwind Labs' }
        ],
        skills: [
          { name: 'Figma Fundamentals', description: 'Frames, shapes, vector networks, groups, and export settings.', category: 'Tools', importance: 'Essential' },
          { name: 'Typography & Visual Hierarchy', description: 'Font pairings, line heights, letter-spacing, and typographic contrast scales.', category: 'Visual Design', importance: 'Essential' },
          { name: 'Color Theory & Accessibility', description: 'Palettes, 60-30-10 rule, semantic colors, and WCAG AA contrast compliance.', category: 'Visual Design', importance: 'Essential' },
          { name: 'Spacing & 8pt Grid Systems', description: 'Consistent layout padding, margins, alignment, and rhythm.', category: 'Visual Design', importance: 'Essential' }
        ]
      },
      {
        stage_order: 2,
        name: 'Intermediate',
        description: 'UX research, wireframing, interactive prototyping, and component design systems.',
        estimated_time: '6-8 weeks',
        project_ideas: [
          {
            title: 'SaaS Collaboration Tool Design System',
            description: 'Reusable component library with variants, interactive states (hover, focus, disabled), and documentation.',
            key_features: ['Figma Component Variants', 'Design Tokens', 'Interactive states', 'Component documentation']
          }
        ],
        resources: [
          { title: 'Nielsen Norman Group - UX Research Articles', url: 'https://www.nngroup.com/articles/', type: 'articles', provider: 'NN/g' },
          { title: 'Design Systems Handbook by InVision', url: 'https://www.designbetter.co/design-systems-handbook', type: 'book', provider: 'DesignBetter' }
        ],
        skills: [
          { name: 'User Research & Personas', description: 'Conducting user interviews, building empathy maps, and defining realistic user personas.', category: 'UX Research', importance: 'Essential' },
          { name: 'Wireframing & Information Architecture', description: 'Low-fidelity user flows, sitemaps, and content hierarchy planning.', category: 'UX Design', importance: 'Essential' },
          { name: 'Design Systems & Component Variants', description: 'Building auto-layout components with property switches, nested variants, and design tokens.', category: 'UI Design', importance: 'Essential' },
          { name: 'Interactive Figma Prototyping', description: 'Smart animate transitions, scroll behaviors, overlay modals, and interactive components.', category: 'Prototyping', importance: 'Essential' }
        ]
      },
      {
        stage_order: 3,
        name: 'Advanced',
        description: 'Usability testing, micro-interactions, responsive mobile patterns, and developer handoff.',
        estimated_time: '8-10 weeks',
        project_ideas: [
          {
            title: 'Health & Fitness Mobile App UX Case Study',
            description: 'End-to-end case study including user interviews, journey mapping, usability testing results, and final Figma prototype.',
            key_features: ['User journey maps', 'A/B usability testing notes', 'Micro-interactions', 'Developer specs']
          }
        ],
        resources: [
          { title: 'Apple Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines', type: 'guide', provider: 'Apple' },
          { title: 'Google Material Design 3 Guidelines', url: 'https://m3.material.io/', type: 'guide', provider: 'Google' }
        ],
        skills: [
          { name: 'Usability Testing & Iteration', description: 'Writing test protocols, running moderated/unmoderated sessions, and synthesising feedback.', category: 'UX Research', importance: 'Essential' },
          { name: 'Micro-interactions & Motion Design', description: 'Designing purposeful feedback animations, button states, and screen transitions.', category: 'Motion', importance: 'Recommended' },
          { name: 'iOS & Android Mobile Guidelines', description: 'Safe areas, navigation bars, bottom sheets, and native platform paradigms.', category: 'Mobile UX', importance: 'Essential' },
          { name: 'Developer Handoff & Redlines', description: 'Writing technical specs, CSS token properties, asset exports, and pairing with engineers.', category: 'Collaboration', importance: 'Essential' }
        ]
      },
      {
        stage_order: 4,
        name: 'Job-ready',
        description: 'Portfolio case study presentations, design leadership, critique defense, and interview readiness.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'End-to-End Enterprise SaaS Product Case Study',
            description: 'Deep dive case study detailing problem definition, business metrics, constraints, failed iterations, and final product impact.',
            key_features: ['Problem statement with business metrics', 'Process documentation', 'Interactive live prototype link', 'Outcome analysis']
          }
        ],
        resources: [
          { title: 'Case Study Club - Curated UX Portfolios', url: 'https://www.casestudy.club/', type: 'inspiration', provider: 'Case Study Club' }
        ],
        skills: [
          { name: 'UX Portfolio Storytelling', description: 'Structuring case studies to highlight business outcomes, design rationale, and personal contribution.', category: 'Portfolio', importance: 'Essential' },
          { name: 'Product Strategy & Business Alignment', description: 'Balancing user needs against business viability, conversion funnels, and technical constraints.', category: 'Strategy', importance: 'Essential' },
          { name: 'Design Critique & Whiteboard Challenges', description: 'Articulating trade-offs under live interview conditions and collaborating constructively.', category: 'Interviews', importance: 'Essential' }
        ]
      }
    ]
  },
  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Automate infrastructure provisioning, CI/CD deployment pipelines, container orchestration, and cloud platform reliability.',
    icon: 'Cpu',
    salary_data: [
      { level: 'Entry Level', experience: '0-2 yrs', min: 7, max: 14, avg: 10.5 },
      { level: 'Mid Level', experience: '2-5 yrs', min: 16, max: 28, avg: 22 },
      { level: 'Senior Level', experience: '5-8 yrs', min: 28, max: 50, avg: 38 },
      { level: 'Lead / Staff', experience: '8+ yrs', min: 52, max: 82, avg: 65 }
    ],
    stages: [
      {
        stage_order: 1,
        name: 'Beginner',
        description: 'Linux system administration, shell scripting, networking, and version control.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'Automated Server Setup Bash Script',
            description: 'Idempotent shell script that hardens an Ubuntu server, creates users, sets up UFW firewall, and configures SSH.',
            key_features: ['UFW firewall configuration', 'SSH key automation', 'Package installation', 'Idempotent logic']
          }
        ],
        resources: [
          { title: 'The Linux Command Line', url: 'https://linuxcommand.org/tlcl.php', type: 'book', provider: 'William Shotts' },
          { title: 'Computer Networking Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanisms/How_does_the_Internet_work', type: 'guide', provider: 'Mozilla' }
        ],
        skills: [
          { name: 'Linux OS Administration', description: 'File systems, permissions, process monitoring (systemd, top), and package managers.', category: 'Linux', importance: 'Essential' },
          { name: 'Bash Scripting & Automation', description: 'Loops, conditionals, arguments, exit codes, and automating routine sysadmin tasks.', category: 'Scripting', importance: 'Essential' },
          { name: 'Computer Networking (DNS, TCP/IP, OSI)', description: 'Understanding ports, subnets, routing, DNS records, and SSL/TLS handshakes.', category: 'Networking', importance: 'Essential' },
          { name: 'Git for Infrastructure', description: 'Trunk-based development, git tagging, and release workflows.', category: 'Tooling', importance: 'Essential' }
        ]
      },
      {
        stage_order: 2,
        name: 'Intermediate',
        description: 'Docker containerization, CI/CD pipelines, Nginx web servers, and cloud platform fundamentals.',
        estimated_time: '6-8 weeks',
        project_ideas: [
          {
            title: 'End-to-End CI/CD Pipeline with GitHub Actions',
            description: 'Automated workflow that runs tests, builds multi-arch Docker images, scans for vulnerabilities, and pushes to registry.',
            key_features: ['Docker multi-stage build', 'Trivy vulnerability scan', 'GitHub Secrets', 'Slack notifications']
          }
        ],
        resources: [
          { title: 'Docker Official Guides', url: 'https://docs.docker.com/', type: 'documentation', provider: 'Docker' },
          { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', type: 'documentation', provider: 'GitHub' }
        ],
        skills: [
          { name: 'Docker & Container Security', description: 'Dockerfile optimization, non-root users, container networking, and vulnerability scanning.', category: 'Containers', importance: 'Essential' },
          { name: 'CI/CD Pipelines (GitHub Actions / GitLab CI)', description: 'Writing automated pipelines, caching dependencies, and managing deployment stages.', category: 'CI/CD', importance: 'Essential' },
          { name: 'Reverse Proxies & Web Servers (Nginx)', description: 'Virtual hosts, SSL termination with Certbot, load balancing, and rate limiting.', category: 'Networking', importance: 'Essential' },
          { name: 'Cloud Fundamentals (AWS / GCP)', description: 'EC2/Compute instances, VPC networks, S3 storage buckets, and IAM security policies.', category: 'Cloud', importance: 'Essential' }
        ]
      },
      {
        stage_order: 3,
        name: 'Advanced',
        description: 'Kubernetes orchestration, Infrastructure as Code with Terraform, and centralized monitoring.',
        estimated_time: '8-10 weeks',
        project_ideas: [
          {
            title: 'Terraform AWS Multi-Tier Cloud Architecture',
            description: 'Automated provisioning of VPC, private subnets, RDS database, and auto-scaling ECS/EKS cluster.',
            key_features: ['Modular Terraform code', 'Remote S3 state backend with locking', 'NAT Gateway', 'Security groups']
          }
        ],
        resources: [
          { title: 'Kubernetes Official Documentation & Tutorials', url: 'https://kubernetes.io/docs/home/', type: 'documentation', provider: 'CNCF' },
          { title: 'Terraform Tutorial - HashiCorp Learn', url: 'https://developer.hashicorp.com/terraform/tutorials', type: 'interactive', provider: 'HashiCorp' }
        ],
        skills: [
          { name: 'Kubernetes (K8s) Orchestration', description: 'Pods, Deployments, Services, Ingress controllers, ConfigMaps, and Secrets.', category: 'Containers', importance: 'Essential' },
          { name: 'Infrastructure as Code (Terraform)', description: 'HCL syntax, state management, modules, providers, and drift detection.', category: 'IaC', importance: 'Essential' },
          { name: 'Monitoring & Metrics (Prometheus & Grafana)', description: 'Setting up exporters, PromQL queries, alerting rules, and visual dashboards.', category: 'Observability', importance: 'Essential' },
          { name: 'Centralized Logging (ELK / Loki)', description: 'Log aggregation, parsing structured logs, and querying runtime incidents.', category: 'Observability', importance: 'Essential' }
        ]
      },
      {
        stage_order: 4,
        name: 'Job-ready',
        description: 'GitOps, Site Reliability Engineering, zero-downtime rolling updates, and high-availability operations.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'GitOps Pipeline with ArgoCD & Helm',
            description: 'Declarative Kubernetes cluster synchronization from Git repository with blue-green canary deployments.',
            key_features: ['Helm chart templates', 'ArgoCD auto-sync', 'Canary rollout with Flagger', 'Rollback triggers']
          }
        ],
        resources: [
          { title: 'Google SRE Book - Site Reliability Engineering', url: 'https://sre.google/sre-book/table-of-contents/', type: 'book', provider: 'Google' }
        ],
        skills: [
          { name: 'GitOps Workflows (ArgoCD / Flux)', description: 'Declarative cluster management, continuous delivery, and automatic sync.', category: 'CI/CD', importance: 'Essential' },
          { name: 'Site Reliability Engineering (SLIs, SLOs, Error Budgets)', description: 'Defining reliability targets, incident response protocols, and post-mortems.', category: 'SRE', importance: 'Essential' },
          { name: 'Zero-Downtime Deployments (Canary / Blue-Green)', description: 'Traffic splitting, automated canary analysis, and instant rollback procedures.', category: 'Deployments', importance: 'Essential' },
          { name: 'DevOps Scenario & Architecture Interviews', description: 'Troubleshooting live outages, scaling cluster bottlenecks, and security audits.', category: 'Interviews', importance: 'Essential' }
        ]
      }
    ]
  },
  {
    slug: 'product-manager',
    title: 'Product Manager',
    description: 'Define product visions, prioritize feature roadmaps, analyze user data, and align engineering, design, and commercial teams.',
    icon: 'Briefcase',
    salary_data: [
      { level: 'Entry Level', experience: '0-2 yrs', min: 8, max: 15, avg: 11.5 },
      { level: 'Mid Level', experience: '2-5 yrs', min: 18, max: 32, avg: 24 },
      { level: 'Senior Level', experience: '5-8 yrs', min: 32, max: 55, avg: 42 },
      { level: 'Lead / Staff', experience: '8+ yrs', min: 55, max: 95, avg: 72 }
    ],
    stages: [
      {
        stage_order: 1,
        name: 'Beginner',
        description: 'Product lifecycle fundamentals, customer interviews, and agile methodologies.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: 'Product Teardown & Opportunity Audit',
            description: 'In-depth analysis of a popular Indian app (e.g. Swiggy, Zerodha) identifying user friction points and feature proposals.',
            key_features: ['User journey audit', 'Friction point breakdown', 'Opportunity solution tree', 'Proposed mockups']
          }
        ],
        resources: [
          { title: 'Product School - The Product Book', url: 'https://productschool.com/book', type: 'book', provider: 'Product School' },
          { title: 'Scrum Guide Official', url: 'https://scrumguides.org/', type: 'guide', provider: 'Ken Schwaber & Jeff Sutherland' }
        ],
        skills: [
          { name: 'Product Lifecycle Fundamentals', description: 'Discovery, validation, MVP definition, growth, maturity, and sunset stages.', category: 'Strategy', importance: 'Essential' },
          { name: 'Customer Interviews & Problem Definition', description: 'Running non-leading user interviews, Mom Test principles, and identifying root problems.', category: 'Discovery', importance: 'Essential' },
          { name: 'Agile & Scrum Methodologies', description: 'Sprint planning, backlog refinement, daily standups, retrospectives, and story points.', category: 'Execution', importance: 'Essential' },
          { name: 'Writing User Stories & Acceptance Criteria', description: 'As a [user], I want to [action] so that [benefit] with crisp Gherkin acceptance tests.', category: 'Execution', importance: 'Essential' }
        ]
      },
      {
        stage_order: 2,
        name: 'Intermediate',
        description: 'Writing comprehensive PRDs, feature prioritization frameworks, and product analytics.',
        estimated_time: '6-8 weeks',
        project_ideas: [
          {
            title: 'Comprehensive Product Requirement Document (PRD)',
            description: 'Complete PRD for a new fintech feature with problem statement, target personas, scope, edge cases, and success metrics.',
            key_features: ['Executive summary', 'User stories with criteria', 'Technical dependencies', 'Launch plan']
          }
        ],
        resources: [
          { title: 'Lenny Rachitsky - Product Management Newsletter & Archives', url: 'https://www.lennysnewsletter.com/', type: 'articles', provider: 'Lenny Rachitsky' },
          { title: 'Amplitude Product Analytics Academy', url: 'https://amplitude.com/academy', type: 'course', provider: 'Amplitude' }
        ],
        skills: [
          { name: 'Writing Comprehensive PRDs', description: 'Authoring clear, unambiguous specification documents that unblock designers and engineers.', category: 'Documentation', importance: 'Essential' },
          { name: 'Prioritization Frameworks (RICE, MoSCoW, Kano)', description: 'Scoring Reach, Impact, Confidence, and Effort to defend quarterly roadmap priorities.', category: 'Prioritization', importance: 'Essential' },
          { name: 'Product Analytics (Mixpanel / PostHog / Amplitude)', description: 'Tracking funnels, retention cohorts, user path analysis, and event instrumentation.', category: 'Analytics', importance: 'Essential' },
          { name: 'Technical Fundamentals for PMs', description: 'Understanding APIs, databases, latency trade-offs, and microservices architecture concepts.', category: 'Technical', importance: 'Essential' }
        ]
      },
      {
        stage_order: 3,
        name: 'Advanced',
        description: 'Growth experimentation, monetization mechanics, and Go-to-Market strategies.',
        estimated_time: '8-10 weeks',
        project_ideas: [
          {
            title: 'B2B SaaS Growth & Pricing Experimentation Strategy',
            description: 'End-to-end plan to increase trial-to-paid conversion rate by 20% through onboarding optimizations and tiered pricing.',
            key_features: ['A/B test hypothesis table', 'Pricing tier model', 'Cohort tracking spec', 'Risk mitigation']
          }
        ],
        resources: [
          { title: 'Reforge - Product Strategy & Growth Frameworks', url: 'https://www.reforge.com/', type: 'guide', provider: 'Reforge' },
          { title: 'Marty Cagan - Inspired: How to Create Tech Products Customers Love', url: 'https://svpg.com/books/', type: 'book', provider: 'Silicon Valley Product Group' }
        ],
        skills: [
          { name: 'A/B Testing & Conversion Rate Optimization (CRO)', description: 'Designing experiments, statistical significance, and continuous onboarding optimization.', category: 'Growth', importance: 'Essential' },
          { name: 'Go-to-Market (GTM) Strategy', description: 'Positioning, launch checklists, sales enablement, marketing collaboration, and release phases.', category: 'Strategy', importance: 'Essential' },
          { name: 'Pricing & Monetization Models', description: 'Freemium vs free-trial, usage-based pricing, unit economics, and churn reduction.', category: 'Business', importance: 'Essential' },
          { name: 'Stakeholder Alignment & Cross-Functional Influence', description: 'Managing competing requirements from Sales, Legal, Engineering, and Executive Leadership.', category: 'Leadership', importance: 'Essential' }
        ]
      },
      {
        stage_order: 4,
        name: 'Job-ready',
        description: 'Long-term product vision, executive presentations, and product management case interview mastery.',
        estimated_time: '4-6 weeks',
        project_ideas: [
          {
            title: '3-Year Strategic Product Vision & Roadmap',
            description: 'Executive roadmap detailing North Star metric, strategic horizons (Now, Next, Later), and competitive moat.',
            key_features: ['North Star Metric framework', 'Horizons roadmap', 'Moat & defensive strategy', 'Resource allocation model']
          }
        ],
        resources: [
          { title: 'Cracking the PM Interview by Gayle Laakmann McDowell', url: 'https://www.crackingthepminterview.com/', type: 'book', provider: 'CareerCup' }
        ],
        skills: [
          { name: 'Strategic Roadmapping & North Star Metric', description: 'Aligning company OKRs to product outcomes and long-term defensible moats.', category: 'Strategy', importance: 'Essential' },
          { name: 'Product Sense & Design Thinking', description: 'Deconstructing ambiguous market problems and crafting simple, elegant solutions.', category: 'Product Sense', importance: 'Essential' },
          { name: 'PM Case Interview Mastery (Product Design, Metrics, Execution)', description: 'Excelling in circular product design cases, metric drop RCA, and behavioral trade-offs.', category: 'Interviews', importance: 'Essential' }
        ]
      }
    ]
  }
];

function seedStage2() {
  console.log('--- Starting Stage 2 Seeding (Career Path & Resumes) ---');

  const existingRolesCount = db.prepare('SELECT COUNT(*) as count FROM career_roles').get().count;

  if (existingRolesCount < 8) {
    console.log('Seeding 8 complete Career Roles with stages and skills...');
    
    // Clear existing to avoid duplicate issues
    db.prepare('DELETE FROM career_skills').run();
    db.prepare('DELETE FROM career_stages').run();
    db.prepare('DELETE FROM career_roles').run();

    const insertRole = db.prepare(`
      INSERT INTO career_roles (slug, title, description, icon, salary_data)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertStage = db.prepare(`
      INSERT INTO career_stages (role_id, stage_order, name, description, estimated_time, project_ideas, resources)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSkill = db.prepare(`
      INSERT INTO career_skills (stage_id, role_id, name, description, category, importance)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const role of ROLES_DATA) {
      const roleResult = insertRole.run(
        role.slug,
        role.title,
        role.description,
        role.icon,
        JSON.stringify(role.salary_data)
      );
      const roleId = roleResult.lastInsertRowid;

      for (const stage of role.stages) {
        const stageResult = insertStage.run(
          roleId,
          stage.stage_order,
          stage.name,
          stage.description,
          stage.estimated_time,
          JSON.stringify(stage.project_ideas || []),
          JSON.stringify(stage.resources || [])
        );
        const stageId = stageResult.lastInsertRowid;

        for (const skill of stage.skills) {
          insertSkill.run(
            stageId,
            roleId,
            skill.name,
            skill.description,
            skill.category || 'Core',
            skill.importance || 'Essential'
          );
        }
      }
    }

    console.log(`Successfully seeded all ${ROLES_DATA.length} career roles and roadmaps.`);
  }

  // Seed demo candidate career goals, progress, and sample resume
  const demoUser = db.prepare("SELECT id FROM users WHERE email = 'demo@careerflow.com'").get();
  if (demoUser) {
    const userId = demoUser.id;

    // Check goals
    const goalsCount = db.prepare('SELECT COUNT(*) as count FROM career_goals WHERE user_id = ?').get(userId).count;
    if (goalsCount === 0) {
      const fullStackRole = db.prepare("SELECT id FROM career_roles WHERE slug = 'full-stack-developer'").get();
      const devOpsRole = db.prepare("SELECT id FROM career_roles WHERE slug = 'devops-engineer'").get();

      if (fullStackRole) {
        db.prepare(`
          INSERT INTO career_goals (user_id, role_id, title, target_date, notes, is_primary)
          VALUES (?, ?, ?, '2026-12-31', 'Targeting Staff Full-Stack roles at high-growth Indian fintech startups.', 1)
        `).run(userId, fullStackRole.id, 'Become Staff Full-Stack Engineer');

        // Seed some completed skills for demo user in Full-Stack Developer path
        const skillsToComplete = db.prepare(`
          SELECT id FROM career_skills 
          WHERE role_id = ? 
          LIMIT 6
        `).all(fullStackRole.id);

        for (const s of skillsToComplete) {
          db.prepare(`
            INSERT OR IGNORE INTO career_progress (user_id, skill_id, role_id)
            VALUES (?, ?, ?)
          `).run(userId, s.id, fullStackRole.id);
        }
      }

      if (devOpsRole) {
        db.prepare(`
          INSERT INTO career_goals (user_id, role_id, title, target_date, notes, is_primary)
          VALUES (?, ?, ?, '2027-06-30', 'Deepen Kubernetes and Terraform infrastructure mastery.', 0)
        `).run(userId, devOpsRole.id, 'Master Cloud Infrastructure & K8s');
      }

      console.log('Seeded demo candidate career goals and progress.');
    }

    // Check sample resume
    const resumeCount = db.prepare('SELECT COUNT(*) as count FROM resumes WHERE user_id = ?').get(userId).count;
    if (resumeCount === 0) {
      const sampleContent = {
        personal_info: {
          full_name: 'Rajveer Sharma',
          headline: 'Senior Full-Stack Engineer | React, Node.js & Distributed Systems',
          email: 'demo@careerflow.com',
          phone: '+91 98765 43210',
          location: 'Bengaluru, India',
          website: 'https://rajveer.dev',
          linkedin: 'https://linkedin.com/in/rajveersharma',
          github: 'https://github.com/rajveersharma'
        },
        summary: 'Results-driven Senior Full-Stack Engineer with 5+ years of experience architecting high-throughput microservices, responsive web applications, and fintech payment infrastructure. Scaled transactional platforms to 10M+ monthly requests while maintaining 99.98% uptime. Passionate about developer tooling, clean code architecture, and high-performance React frontends.',
        experience: [
          {
            id: 'exp-1',
            role: 'Senior Software Engineer',
            company: 'Razorpay Technologies',
            location: 'Bengaluru, India',
            start_date: '2023-01',
            end_date: '',
            is_current: true,
            description: 'Lead engineering for the merchant onboarding and payment checkout experience.',
            bullets: [
              'Architected and deployed a micro-frontend checkout module serving 15M+ monthly active shoppers, cutting bundle load time by 42%.',
              'Engineered an idempotent payment processing pipeline using Node.js, Redis, and PostgreSQL, handling up to 1,200 transactions per second.',
              'Mentored 6 engineers in automated testing (Vitest, Playwright), driving test coverage from 68% to 92% across critical services.'
            ]
          },
          {
            id: 'exp-2',
            role: 'Full-Stack Developer',
            company: 'Swiggy',
            location: 'Bengaluru, India',
            start_date: '2021-06',
            end_date: '2022-12',
            is_current: false,
            description: 'Built customer-facing ordering flows and real-time delivery tracking maps.',
            bullets: [
              'Developed real-time driver tracking interface with WebSockets and Google Maps API, reducing customer support queries by 24%.',
              'Optimized Core Web Vitals (LCP, CLS) across desktop and mobile web, boosting organic conversion rate by 18%.',
              'Collaborated with product designers to implement an accessible component library with 40+ reusable React UI components.'
            ]
          }
        ],
        education: [
          {
            id: 'edu-1',
            degree: 'Bachelor of Technology in Computer Science & Engineering',
            institution: 'National Institute of Technology (NIT), Karnataka',
            location: 'Surathkal, India',
            start_year: 2017,
            end_year: 2021,
            grade: '8.8 CGPA',
            description: 'Specialized in Distributed Computing, Data Structures & Algorithms, and Database Management Systems.'
          }
        ],
        projects: [
          {
            id: 'proj-1',
            title: 'CareerFlow - Job Search & Career Intelligence Platform',
            description: 'Full-stack recruitment portal featuring algorithmic skill match scoring, visual Kanban tracking, and interactive career roadmaps.',
            tech_stack: 'React, Vite, Node.js, Express, SQLite, Tailwind CSS, Framer Motion',
            live_url: 'https://careerflow.app',
            github_url: 'https://github.com/rajveersharma/careerflow',
            bullets: [
              'Implemented drag-and-drop Kanban application tracker with real-time status transitions and interview scheduling.',
              'Designed responsive salary analytics and skill gap evaluation matching user competencies against 8 core tech paths.'
            ]
          },
          {
            id: 'proj-2',
            title: 'DevPulse - Cloud API Observability & Telemetry Gateway',
            description: 'Distributed latency monitoring tool with real-time health checks, error alerting, and webhook integrations.',
            tech_stack: 'TypeScript, Go, Redis, Docker, Prometheus',
            live_url: 'https://devpulse.io',
            github_url: 'https://github.com/rajveersharma/devpulse',
            bullets: [
              'Engineered time-series telemetry aggregator processing 50k metric datapoints per minute with sub-10ms query response.'
            ]
          }
        ],
        skills: {
          'Languages': ['JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL', 'HTML5', 'CSS3'],
          'Frontend': ['React.js', 'Next.js', 'Tailwind CSS', 'Redux Toolkit', 'Zustand', 'Framer Motion'],
          'Backend & Databases': ['Node.js', 'Express', 'PostgreSQL', 'SQLite', 'Redis', 'RESTful APIs', 'GraphQL'],
          'DevOps & Tools': ['Docker', 'Git', 'GitHub Actions', 'Linux CLI', 'Vite', 'Vitest', 'Postman']
        },
        certifications: [
          {
            id: 'cert-1',
            name: 'AWS Certified Solutions Architect - Associate',
            issuer: 'Amazon Web Services',
            date: '2024-03',
            url: 'https://aws.amazon.com/certification/'
          }
        ],
        achievements: [
          {
            id: 'ach-1',
            title: '1st Place Winner - Razorpay Internal Hackathon 2023',
            description: 'Built a 1-click merchant reconciliation tool adopted by 2,000+ business accounts.'
          },
          {
            id: 'ach-2',
            title: 'Open Source Contributor',
            description: 'Maintained and contributed bug fixes to popular React open-source ecosystem repositories.'
          }
        ],
        languages: [
          { id: 'lang-1', language: 'English', proficiency: 'Fluent / Professional' },
          { id: 'lang-2', language: 'Hindi', proficiency: 'Native' }
        ],
        links: [
          { id: 'link-1', label: 'Portfolio', url: 'https://rajveer.dev' },
          { id: 'link-2', label: 'GitHub', url: 'https://github.com/rajveersharma' },
          { id: 'link-3', label: 'LinkedIn', url: 'https://linkedin.com/in/rajveersharma' }
        ],
        section_order: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements', 'languages'],
        section_visibility: {
          summary: true,
          experience: true,
          projects: true,
          skills: true,
          education: true,
          certifications: true,
          achievements: true,
          languages: true
        }
      };

      db.prepare(`
        INSERT INTO resumes (user_id, title, template, accent_color, font_family, font_size, content, ats_score)
        VALUES (?, ?, 'modern', '#4f46e5', 'Inter', 'normal', ?, 88)
      `).run(
        userId,
        'Rajveer Sharma - Senior Full-Stack Engineer',
        JSON.stringify(sampleContent)
      );

      console.log('Seeded demo candidate sample resume.');
    }
  }

  console.log('--- Stage 2 Seeding Complete ---');
}

module.exports = seedStage2;
