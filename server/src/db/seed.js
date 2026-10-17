const bcrypt = require('bcryptjs');
const db = require('./database');

function seedDatabase() {
  console.log('--- Starting CareerFlow Database Seeding ---');

  // Check if jobs already seeded
  const jobCount = db.prepare('SELECT COUNT(*) as count FROM jobs').get().count;
  
  if (jobCount < 50) {
    console.log('Seeding jobs...');
    // Clear existing jobs to ensure clean state
    db.prepare('DELETE FROM jobs').run();

    const jobsData = [
      {
        title: "Senior Full-Stack Engineer",
        company: "Razorpay",
        logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
        location: "Bengaluru",
        job_type: "Full-time",
        experience_level: "Senior Level",
        salary_min: 28,
        salary_max: 42,
        category: "Engineering",
        skills: ["React", "TypeScript", "Node.js", "Docker", "PostgreSQL", "Microservices"],
        description: "Razorpay is seeking a talented Senior Full-Stack Engineer to architect and build our next-generation payment gateway and developer checkout infrastructure.",
        requirements: JSON.stringify([
          "5+ years of software development experience with React, TypeScript, and Node.js",
          "Demonstrated expertise with distributed systems and relational databases (PostgreSQL/MySQL)",
          "Strong understanding of microservices architecture, Docker, and CI/CD pipelines",
          "Experience in fintech or high-volume transactional platforms is a big plus"
        ]),
        responsibilities: JSON.stringify([
          "Lead design and implementation of highly available and scalable merchant services",
          "Mentor junior and mid-level engineers through code reviews and technical guidance",
          "Collaborate closely with product managers, UX designers, and site reliability teams",
          "Drive code quality, test automation, and engineering excellence across the organization"
        ]),
        benefits: JSON.stringify(["Health & Wellness Coverage", "Flexible Work Hours", "Stock Options (ESOPs)", "Annual Learning Budget"]),
        company_website: "https://razorpay.com",
        company_size: "1000-5000 employees",
        industry: "Financial Technology",
        is_featured: 1
      },
      {
        title: "Lead Frontend Architect",
        company: "Swiggy",
        logo_url: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80",
        location: "Bengaluru",
        job_type: "Full-time",
        experience_level: "Lead / Staff",
        salary_min: 35,
        salary_max: 55,
        category: "Engineering",
        skills: ["React", "Next.js", "TypeScript", "Performance Optimization", "Webpack", "Tailwind CSS"],
        description: "Drive the web frontend architecture across Swiggy consumer food delivery and Instamart quick commerce platforms serving tens of millions of active customers.",
        requirements: JSON.stringify([
          "7+ years of frontend engineering experience with 3+ years in architectural roles",
          "Mastery of modern web performance metrics (Core Web Vitals), state management, and SSR/SSG",
          "Deep familiarity with React internals, bundle optimization, and micro-frontends",
          "Excellent communication skills and cross-functional leadership ability"
        ]),
        responsibilities: JSON.stringify([
          "Define the technical roadmap for web applications across mobile web and desktop portals",
          "Set company-wide standards for web performance, security, and component design systems",
          "Evaluate new frontend frameworks, build tooling, and monitoring platforms",
          "Lead architectural review boards and foster frontend community inside Swiggy"
        ]),
        benefits: JSON.stringify(["Competitive Equity", "Comprehensive Medical Cover", "Free Food Stipend", "Relocation Assistance"]),
        company_website: "https://swiggy.com",
        company_size: "5000+ employees",
        industry: "Consumer Tech & Logistics",
        is_featured: 1
      },
      {
        title: "Backend Platform Engineer (Go / Node.js)",
        company: "Zerodha",
        logo_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80",
        location: "Bengaluru",
        job_type: "Full-time",
        experience_level: "Mid Level",
        salary_min: 22,
        salary_max: 36,
        category: "Engineering",
        skills: ["Go", "Node.js", "PostgreSQL", "Redis", "Kafka", "Linux"],
        description: "Join Zerodha's engineering team building ultra-low-latency, resilient order routing engines and financial market data feeds.",
        requirements: JSON.stringify([
          "3+ years of backend systems engineering experience using Go, Node.js, or C++",
          "Strong grasp of concurrency primitives, networking protocols (TCP/WebSocket), and memory management",
          "Solid experience with PostgreSQL query tuning, connection pools, and Redis caching",
          "Passion for open source software, minimalist architecture, and self-hosted infrastructure"
        ]),
        responsibilities: JSON.stringify([
          "Build and maintain mission-critical trading APIs handling millions of real-time orders",
          "Optimize throughput and decrease latencies down to single-digit milliseconds",
          "Diagnose production bottlenecks and implement proactive observability",
          "Contribute to open-source developer tooling and developer documentation"
        ]),
        benefits: JSON.stringify(["Uncapped Profit Sharing", "Zero Bureaucracy Culture", "Premium Medical Insurance", "Books & Gadget Allowance"]),
        company_website: "https://zerodha.com",
        company_size: "500-1000 employees",
        industry: "Capital Markets & FinTech",
        is_featured: 1
      },
      {
        title: "Staff Machine Learning Engineer",
        company: "Zomato",
        logo_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=128&auto=format&fit=crop&q=80",
        location: "Delhi NCR",
        job_type: "Full-time",
        experience_level: "Lead / Staff",
        salary_min: 40,
        salary_max: 65,
        category: "Data & AI",
        skills: ["Python", "PyTorch", "MLOps", "Recommendation Systems", "Kubernetes", "Transformers"],
        description: "Lead the recommendation, personalized discovery, and dynamic ETA estimation models powering millions of daily food orders.",
        requirements: JSON.stringify([
          "6+ years of production ML engineering experience with emphasis on real-time ranking and recommendations",
          "Expertise in deep learning frameworks (PyTorch/TensorFlow) and feature stores (Feast)",
          "Track record of deploying large scale models in production with low inference latencies",
          "M.S. or Ph.D. in Computer Science, Data Science, or related quantitative field preferred"
        ]),
        responsibilities: JSON.stringify([
          "Direct AI/ML strategy for home feed personalization and search relevance algorithms",
          "Collaborate with backend platform teams to deploy high-throughput ML microservices",
          "Design rigorous offline-to-online evaluation pipelines and multi-armed bandit experiments",
          "Publish patents and research findings in premier machine learning conferences"
        ]),
        benefits: JSON.stringify(["Aggressive Stock Grants", "Unlimited Paid Time Off", "Health Insurance for Family", "Gym Membership"]),
        company_website: "https://zomato.com",
        company_size: "1000-5000 employees",
        industry: "Food Delivery & Hyperlocal",
        is_featured: 1
      },
      {
        title: "Senior Product Designer (UI/UX)",
        company: "CRED",
        logo_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&auto=format&fit=crop&q=80",
        location: "Bengaluru",
        job_type: "Full-time",
        experience_level: "Senior Level",
        salary_min: 26,
        salary_max: 38,
        category: "Design",
        skills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "User Research", "Micro-interactions"],
        description: "Craft immersive, bespoke, and award-winning member experiences for credit card payments, luxury commerce, and peer-to-peer lending.",
        requirements: JSON.stringify([
          "4+ years of product design experience designing consumer-facing mobile and web applications",
          "Stellar portfolio exhibiting high craftsmanship in visual design, micro-interactions, and design systems",
          "Deep proficiency in Figma, Framer, Principle, and vector illustration tools",
          "Strong ability to translate complex financial concepts into intuitive, playful experiences"
        ]),
        responsibilities: JSON.stringify([
          "Own design execution end-to-end for flagship CRED products from discovery to launch",
          "Collaborate daily with frontend engineers to ensure pixel-perfect fidelity and smooth animations",
          "Run qualitative user studies, usability testing, and synthesize behavioral data",
          "Contribute innovative patterns and components to CRED's design language system (Neo)"
        ]),
        benefits: JSON.stringify(["Top Tier ESOPs", "Premium Health Insurance", "Wellness Stipend", "State-of-the-art Hardware"]),
        company_website: "https://cred.club",
        company_size: "500-1000 employees",
        industry: "FinTech & Luxury Commerce",
        is_featured: 1
      },
      {
        title: "DevOps & Cloud Infrastructure Specialist",
        company: "Postman",
        logo_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=128&auto=format&fit=crop&q=80",
        location: "Remote",
        job_type: "Remote",
        experience_level: "Senior Level",
        salary_min: 30,
        salary_max: 48,
        category: "DevOps & Cloud",
        skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Prometheus", "Datadog"],
        description: "Scale Postman's cloud platform supporting over 30 million API developers globally. Automate multi-region deployments and enforce zero-trust security.",
        requirements: JSON.stringify([
          "5+ years supporting high-traffic cloud infrastructure on AWS or GCP",
          "Advanced proficiency in Kubernetes cluster administration, service mesh, and GitOps",
          "Solid infrastructure-as-code expertise using Terraform, Helm, and Terragrunt",
          "Strong scripting skills in Python, Bash, or Go"
        ]),
        responsibilities: JSON.stringify([
          "Build resilient multi-region infrastructure to ensure 99.99% availability for API calls",
          "Streamline CI/CD pipelines to empower hundreds of daily engineer releases",
          "Implement automated security scanning, vulnerability mitigation, and cost optimization",
          "Participate in on-call rotations and lead blameless post-mortem analysis"
        ]),
        benefits: JSON.stringify(["100% Remote Flexibility", "Home Office Setup Allowance", "Annual Wellness Credit", "Generous Equity"]),
        company_website: "https://postman.com",
        company_size: "1000-5000 employees",
        industry: "Developer Tools & SaaS",
        is_featured: 1
      },
      {
        title: "Full-Stack Engineer (React & Python)",
        company: "Meesho",
        logo_url: "https://images.unsplash.com/photo-1542744094-3a31727560fa?w=128&auto=format&fit=crop&q=80",
        location: "Bengaluru",
        job_type: "Full-time",
        experience_level: "Mid Level",
        salary_min: 18,
        salary_max: 28,
        category: "Engineering",
        skills: ["React", "Python", "Django", "PostgreSQL", "Redis", "REST API"],
        description: "Democratize internet commerce for 100 million small businesses and resellers across tier-2 and tier-3 India.",
        requirements: JSON.stringify([
          "3+ years building full-stack applications with React and Python (Django/FastAPI)",
          "Experience optimizing web pages for low-bandwidth networks and entry-level mobile devices",
          "Solid knowledge of relational database modeling and transactional integrity",
          "Strong product mindset and enthusiasm for solving Bharat-specific e-commerce challenges"
        ]),
        responsibilities: JSON.stringify([
          "Develop seller dashboard features for catalog management, pricing, and order fulfillment",
          "Create reusable responsive UI components with clean state management",
          "Integrate with logistics APIs and automated shipping label generators",
          "Measure performance using Google Lighthouse and APM tools"
        ]),
        benefits: JSON.stringify(["Health Insurance", "Subsidized Meals", "Performance Bonuses", "Learning Allowance"]),
        company_website: "https://meesho.io",
        company_size: "1000-5000 employees",
        industry: "E-Commerce",
        is_featured: 0
      },
      {
        title: "Senior Android Developer (Kotlin)",
        company: "PhonePe",
        logo_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80",
        location: "Pune",
        job_type: "Full-time",
        experience_level: "Senior Level",
        salary_min: 25,
        salary_max: 38,
        category: "Engineering",
        skills: ["Kotlin", "Android SDK", "Jetpack Compose", "Coroutines", "Dagger Hilt", "Clean Architecture"],
        description: "Build ultra-secure and high-performing digital payment workflows for PhonePe's 450+ million registered users.",
        requirements: JSON.stringify([
          "5+ years of dedicated native Android app development with Kotlin",
          "Extensive experience with Jetpack Compose, Coroutines, Flow, and MVVM / MVI patterns",
          "Deep understanding of Android security, encryption standards, and biometric authentication",
          "Experience with automated UI testing using Espresso and MockK"
        ]),
        responsibilities: JSON.stringify([
          "Develop features for UPI payments, insurance aggregation, and mutual funds investments",
          "Optimize app startup time, APK size, and memory footprint across varied OEM devices",
          "Collaborate with security auditing teams to ensure strict RBI compliance",
          "Mentor junior mobile engineers and participate in architectural reviews"
        ]),
        benefits: JSON.stringify(["Attractive ESOPs", "Family Medical Insurance", "Flexible Work Options", "Skill Upgrade Subsidy"]),
        company_website: "https://phonepe.com",
        company_size: "5000+ employees",
        industry: "FinTech & Payments",
        is_featured: 0
      },
      {
        title: "Product Manager - Growth & Retention",
        company: "Groww",
        logo_url: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=128&auto=format&fit=crop&q=80",
        location: "Bengaluru",
        job_type: "Full-time",
        experience_level: "Mid Level",
        salary_min: 20,
        salary_max: 32,
        category: "Product",
        skills: ["Product Management", "A/B Testing", "Mixpanel", "SQL", "User Acquisition", "Conversion Rate Optimization"],
        description: "Drive user engagement, activation funnels, and organic viral growth for India's premier stock and mutual fund investing app.",
        requirements: JSON.stringify([
          "3+ years product management experience at a high-growth B2C consumer tech startup",
          "Strong quantitative acumen: SQL, cohort analysis, funnel metrics, and statistical significance testing",
          "Customer-obsessed mindset with empathy for first-time retail investors",
          "Engineering or business degree from a top tier institution preferred"
        ]),
        responsibilities: JSON.stringify([
          "Define product roadmaps for onboarding, KYC automation, and referral loops",
          "Conduct user interviews, analyze drop-off rates, and run rapid A/B experiments",
          "Work closely with engineering, design, marketing, and compliance leaders",
          "Present weekly growth dashboards and strategic insights to executive leadership"
        ]),
        benefits: JSON.stringify(["Fast-Track Career Growth", "Stock Options", "Comprehensive Healthcare", "Annual Company Offsites"]),
        company_website: "https://groww.in",
        company_size: "1000-5000 employees",
        industry: "WealthTech",
        is_featured: 0
      },
      {
        title: "Frontend Software Engineer (React / Next.js)",
        company: "BrowserStack",
        logo_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80",
        location: "Mumbai",
        job_type: "Full-time",
        experience_level: "Mid Level",
        salary_min: 16,
        salary_max: 26,
        category: "Engineering",
        skills: ["React", "Next.js", "TypeScript", "Redux Toolkit", "CSS Modules", "Jest"],
        description: "Join the world's leading cloud web and mobile testing platform. Help developers build faultless software with our high-speed interactive test dashboards.",
        requirements: JSON.stringify([
          "2-5 years hands-on frontend web application development experience",
          "Solid knowledge of JavaScript (ES6+), React hooks, and TypeScript",
          "Familiarity with WebSocket communication and real-time remote screen streaming",
          "Commitment to writing unit and integration tests (Jest / React Testing Library)"
        ]),
        responsibilities: JSON.stringify([
          "Build intuitive UI for remote browser sessions, live debugging logs, and automated test runners",
          "Ensure compatibility across all modern desktop web browsers",
          "Optimize canvas rendering and video playback controls for low latency",
          "Participate in agile sprints, daily standups, and code review workflows"
        ]),
        benefits: JSON.stringify(["Health Insurance", "Work-Life Balance Culture", "Hybrid Work Setup", "Education Reimbursement"]),
        company_website: "https://browserstack.com",
        company_size: "1000-5000 employees",
        industry: "Cloud & Testing Infrastructure",
        is_featured: 0
      },
      {
        title: "Senior Backend Engineer (Node.js & GraphQL)",
        company: "Hasura",
        logo_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=80",
        location: "Remote",
        job_type: "Remote",
        experience_level: "Senior Level",
        salary_min: 32,
        salary_max: 50,
        category: "Engineering",
        skills: ["Node.js", "GraphQL", "PostgreSQL", "TypeScript", "REST API", "Docker"],
        description: "Build cutting-edge GraphQL and REST instant data APIs that connect to multi-cloud databases for developers around the globe.",
        requirements: JSON.stringify([
          "4+ years building high-performance backend systems with Node.js and TypeScript",
          "Deep experience crafting and consuming GraphQL APIs, schema design, and AST manipulation",
          "In-depth understanding of PostgreSQL query planning, indexing, and connection pooling",
          "Comfortable working asynchronously in an open-source, globally distributed team"
        ]),
        responsibilities: JSON.stringify([
          "Architect core cloud platform connectors for relational and vector databases",
          "Implement high-performance caching and query caching middleware",
          "Author technical blogs, developer tutorials, and sample reference architectures",
          "Collaborate with open-source community contributors on GitHub"
        ]),
        benefits: JSON.stringify(["USD Competitive Compensation", "Global Remote Stipend", "Flexible Vacation", "Health Insurance"]),
        company_website: "https://hasura.io",
        company_size: "200-500 employees",
        industry: "Developer Tools & Cloud",
        is_featured: 0
      },
      {
        title: "Data Engineer (BigQuery & Apache Spark)",
        company: "Nykaa",
        logo_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=128&auto=format&fit=crop&q=80",
        location: "Mumbai",
        job_type: "Full-time",
        experience_level: "Mid Level",
        salary_min: 15,
        salary_max: 24,
        category: "Data & AI",
        skills: ["SQL", "Python", "Apache Spark", "BigQuery", "Airflow", "Kafka"],
        description: "Scale Nykaa's omni-channel customer intelligence platform, inventory forecasting, and real-time marketing clickstream pipelines.",
        requirements: JSON.stringify([
          "3+ years experience designing robust batch and streaming ETL data pipelines",
          "Strong proficiency in SQL, Python, Apache Airflow, and Apache Spark",
          "Hands-on experience with modern data warehouses (BigQuery, Snowflake, or Redshift)",
          "Understanding of dimensional data modeling and data quality assurance"
        ]),
        responsibilities: JSON.stringify([
          "Build scalable ETL pipelines aggregating data from hundreds of physical retail stores and online channels",
          "Maintain daily Airflow DAGs feeding business intelligence dashboards (Looker / PowerBI)",
          "Implement data lineage, automated anomaly detection, and schema validation",
          "Partner with data scientists to prepare training feature sets"
        ]),
        benefits: JSON.stringify(["Employee Beauty Discounts", "Health Insurance", "Festival Bonuses", "Training Stipend"]),
        company_website: "https://nykaa.com",
        company_size: "1000-5000 employees",
        industry: "Retail & E-Commerce",
        is_featured: 0
      },
      {
        title: "Junior Software Engineer (Full-Stack)",
        company: "Freshworks",
        logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80",
        location: "Chennai",
        job_type: "Full-time",
        experience_level: "Entry Level",
        salary_min: 8,
        salary_max: 14,
        category: "Engineering",
        skills: ["JavaScript", "React", "Node.js", "MySQL", "HTML5", "CSS3"],
        description: "Kickstart your engineering career building customer support CRM software used by over 60,000 global companies.",
        requirements: JSON.stringify([
          "Bachelor's degree in Computer Science, IT, or equivalent practical coding experience",
          "Proficiency in core JavaScript fundamentals, DOM APIs, and basic React components",
          "Understanding of RESTful APIs, relational databases (MySQL/PostgreSQL), and Git workflows",
          "Eager to learn, take feedback, and solve complex software problems with mentors"
        ]),
        responsibilities: JSON.stringify([
          "Build clean, responsive user interface modules for customer ticket management",
          "Write clean, well-tested backend endpoints in Node.js",
          "Fix bugs identified in QA testing and assist with customer support escalations",
          "Collaborate in code reviews and participate in internal hackathons"
        ]),
        benefits: JSON.stringify(["Mentorship Program", "Subsidized Transport & Meals", "Comprehensive Health Cover", "Continuous Learning Courses"]),
        company_website: "https://freshworks.com",
        company_size: "5000+ employees",
        industry: "Enterprise SaaS & CRM",
        is_featured: 0
      },
      {
        title: "Cloud Security Engineer",
        company: "Zeta",
        logo_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=128&auto=format&fit=crop&q=80",
        location: "Bengaluru",
        job_type: "Full-time",
        experience_level: "Senior Level",
        salary_min: 28,
        salary_max: 44,
        category: "DevOps & Cloud",
        skills: ["Cloud Security", "AWS", "IAM", "Vulnerability Management", "Kubernetes", "SIEM"],
        description: "Fortify cloud banking core infrastructure against advanced persistent threats and ensure strict PCI-DSS and SOC2 compliance.",
        requirements: JSON.stringify([
          "4+ years in cloud security, DevSecOps, or application security roles",
          "Hands-on expertise with AWS IAM least privilege, guardrails, and VPC flow analysis",
          "Experience with container security scanning (Trivy, Prisma Cloud) and SAST/DAST tools",
          "Security certifications (AWS Security Specialty, CISSP, or CEH) are advantageous"
        ]),
        responsibilities: JSON.stringify([
          "Design automated security guardrails and remediation routines for multi-account AWS setups",
          "Conduct threat modeling exercises and penetration tests with engineering squads",
          "Manage incident response playbooks and triage SIEM security alerts",
          "Ensure adherence to regulatory standards across multinational banking partners"
        ]),
        benefits: JSON.stringify(["Substantial Stock Grants", "Family Health Coverage", "Fitness Allowance", "Catered Meals"]),
        company_website: "https://zeta.tech",
        company_size: "1000-5000 employees",
        industry: "Core Banking & FinTech",
        is_featured: 0
      },
      {
        title: "Frontend Engineering Intern",
        company: "Innovaccer",
        logo_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80",
        location: "Delhi NCR",
        job_type: "Internship",
        experience_level: "Entry Level",
        salary_min: 5,
        salary_max: 8,
        category: "Engineering",
        skills: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Git"],
        description: "Join our healthcare analytics team for a 6-month intensive internship with strong pre-placement offer (PPO) potential.",
        requirements: JSON.stringify([
          "Pre-final or final year engineering students (B.Tech / B.E. / MCA)",
          "Demonstrated personal or academic web projects built with React and modern CSS",
          "Good foundation in computer science fundamentals, data structures, and algorithms",
          "Enthusiasm for building software that improves patient clinical outcomes"
        ]),
        responsibilities: JSON.stringify([
          "Assist senior engineers with building clinical dashboard charts and form components",
          "Write unit tests and verify UI responsiveness on mobile and tablet screens",
          "Participate in daily engineering standups and sprint planning",
          "Document code patterns and component usage for design system guidelines"
        ]),
        benefits: JSON.stringify(["Monthly Stipend", "Mentorship from Staff Engineers", "Certificate of Completion", "PPO Opportunity"]),
        company_website: "https://innovaccer.com",
        company_size: "1000-5000 employees",
        industry: "HealthTech & Big Data",
        is_featured: 0
      },
      {
        title: "Staff Systems Engineer (Embedded & IoT)",
        company: "Ather Energy",
        logo_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=128&auto=format&fit=crop&q=80",
        location: "Bengaluru",
        job_type: "Full-time",
        experience_level: "Senior Level",
        salary_min: 26,
        salary_max: 40,
        category: "Engineering",
        skills: ["C++", "Embedded Linux", "RTOS", "CAN Protocol", "Python", "System Architecture"],
        description: "Engineer the next generation smart dashboard and vehicle telematics OS for Ather's smart electric scooters.",
        requirements: JSON.stringify([
          "5+ years in embedded systems or automotive firmware engineering",
          "Strong proficiency in modern C/C++, Embedded Linux, and RTOS concepts",
          "Experience with CAN bus communications, telemetry over 4G/LTE, and firmware OTA updates",
          "Familiarity with automotive safety standards (ISO 26262) is a strong plus"
        ]),
        responsibilities: JSON.stringify([
          "Architect real-time data acquisition from battery management systems (BMS) and motor controllers",
          "Build low-latency communication layer between vehicle sensors and cloud telemetry services",
          "Optimize boot time and power management modes for instrument cluster displays",
          "Collaborate with hardware designers on board bring-up and validation"
        ]),
        benefits: JSON.stringify(["Vehicle Lease Discounts", "Comprehensive Medical Insurance", "ESOPs", "Patent Bonuses"]),
        company_website: "https://atherenergy.com",
        company_size: "1000-5000 employees",
        industry: "CleanTech & EV",
        is_featured: 0
      },
      {
        title: "Growth Marketing Manager",
        company: "Urban Company",
        logo_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=128&auto=format&fit=crop&q=80",
        location: "Delhi NCR",
        job_type: "Full-time",
        experience_level: "Mid Level",
        salary_min: 16,
        salary_max: 25,
        category: "Marketing",
        skills: ["Performance Marketing", "Google Ads", "Meta Ads", "Analytics", "SEO", "Growth Strategy"],
        description: "Spearhead performance marketing campaigns and customer acquisition channels for home services across 50+ cities.",
        requirements: JSON.stringify([
          "3+ years managing multi-crore digital ad budgets across Google, Meta, and affiliate networks",
          "Advanced proficiency in Google Analytics 4, AppsFlyer, and attribution modeling",
          "Data-driven storytelling ability with expertise in Excel and BI tools",
          "Proven track record of lowering customer acquisition costs (CAC) while scaling volume"
        ]),
        responsibilities: JSON.stringify([
          "Design, launch, and optimize paid acquisition campaigns across search, social, and display",
          "Collaborate with creative design team to iterate high-converting video and static ad assets",
          "Partner with category managers to drive seasonal festival promotions and discounts",
          "Report weekly ROI, ROAS, and customer lifetime value (LTV) metrics to business heads"
        ]),
        benefits: JSON.stringify(["Employee Service Credits", "Medical Insurance", "Quarterly Bonuses", "Flexible Working"]),
        company_website: "https://urbancompany.com",
        company_size: "1000-5000 employees",
        industry: "Consumer Services & Gig Economy",
        is_featured: 0
      },
      {
        title: "Senior QA Automation Engineer",
        company: "Juspay",
        logo_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=128&auto=format&fit=crop&q=80",
        location: "Bengaluru",
        job_type: "Full-time",
        experience_level: "Senior Level",
        salary_min: 18,
        salary_max: 30,
        category: "Engineering",
        skills: ["Playwright", "Selenium", "TypeScript", "Jest", "CI/CD", "Load Testing"],
        description: "Ensure unmatched reliability and 99.999% uptime for payment SDKs that process over 100 million transactions daily.",
        requirements: JSON.stringify([
          "4+ years building robust end-to-end automation test frameworks (Playwright, Cypress, or Appium)",
          "Proficiency in TypeScript or JavaScript for scripting resilient tests",
          "Experience in API testing (Postman / Newman / REST Assured) and performance testing with k6 or JMeter",
          "Strong understanding of CI/CD integration using GitHub Actions or GitLab CI"
        ]),
        responsibilities: JSON.stringify([
          "Build scalable test frameworks covering web, Android, and iOS payment checkouts",
          "Automate regression test suites to run on every commit in the release pipeline",
          "Simulate complex network failures, slow connections, and edge-case banking responses",
          "Advocate for quality-first engineering practices and maintain test coverage dashboards"
        ]),
        benefits: JSON.stringify(["Competitive Compensation", "Comprehensive Health Insurance", "Learning Sponsorship", "Flexible Hours"]),
        company_website: "https://juspay.in",
        company_size: "500-1000 employees",
        industry: "Payments Infrastructure",
        is_featured: 0
      },
      {
        title: "Technical Lead (Distributed Systems)",
        company: "Darwinbox",
        logo_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=128&auto=format&fit=crop&q=80",
        location: "Hyderabad",
        job_type: "Full-time",
        experience_level: "Lead / Staff",
        salary_min: 34,
        salary_max: 52,
        category: "Engineering",
        skills: ["Java", "Spring Boot", "Microservices", "Kafka", "Elasticsearch", "AWS"],
        description: "Lead the core HR tech enterprise engine serving 2+ million enterprise employees across 750+ global organizations.",
        requirements: JSON.stringify([
          "7+ years architecting enterprise SaaS backends with Java, Spring Boot, or Go",
          "Deep understanding of multi-tenant database partitioning, distributed locking, and event streaming",
          "Proven capability in leading agile squads of 6-10 senior and mid-level engineers",
          "Experience addressing high enterprise security standards and audit requirements"
        ]),
        responsibilities: JSON.stringify([
          "Drive architecture for global payroll, attendance, and performance management modules",
          "Break down monolithic components into resilient, independently deployable microservices",
          "Mentor tech leads and establish clear architectural standards and documentation",
          "Participate in high-stakes enterprise client architectural reviews"
        ]),
        benefits: JSON.stringify(["High Value ESOPs", "Global Relocation Opportunities", "Family Health Coverage", "Executive Coaching"]),
        company_website: "https://darwinbox.com",
        company_size: "1000-5000 employees",
        industry: "HRTech & Enterprise SaaS",
        is_featured: 0
      },
      {
        title: "Full-Stack Web Developer (Contract)",
        company: "Khatabook",
        logo_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&auto=format&fit=crop&q=80",
        location: "Remote",
        job_type: "Contract",
        experience_level: "Mid Level",
        salary_min: 14,
        salary_max: 22,
        category: "Engineering",
        skills: ["React", "Node.js", "Express", "Tailwind CSS", "MongoDB", "REST API"],
        description: "6-month renewable contract to build intuitive merchant reporting and digital invoice generation web interfaces.",
        requirements: JSON.stringify([
          "3+ years building full-stack web portals using React, Node.js, and Express",
          "Strong experience building responsive data tables, PDF invoice exports, and filterable dashboards",
          "Ability to deliver high quality features independently with minimal handholding",
          "Available immediately for a full-time contract engagement"
        ]),
        responsibilities: JSON.stringify([
          "Develop customer invoice generator and GST tax breakdown portal",
          "Integrate with WhatsApp notification and SMS receipt dispatch services",
          "Optimize client-side rendering for complex ledger transaction lists",
          "Deliver weekly functional demos and collaborate with backend API engineers"
        ]),
        benefits: JSON.stringify(["100% Remote", "High Hourly / Monthly Retainer", "Flexible Schedule", "Potential Full-Time Conversion"]),
        company_website: "https://khatabook.com",
        company_size: "500-1000 employees",
        industry: "MSME FinTech",
        is_featured: 0
      }
    ];

    // Let's generate 32 more realistic, distinct jobs to reach over 50 jobs!
    const cities = ["Bengaluru", "Hyderabad", "Pune", "Mumbai", "Delhi NCR", "Chennai", "Remote"];
    const companies = [
      { name: "ShareChat", industry: "Social Media & Video", size: "1000-5000 employees", url: "https://sharechat.com" },
      { name: "BharatPe", industry: "FinTech & Lending", size: "1000-5000 employees", url: "https://bharatpe.com" },
      { name: "Zepto", industry: "Quick Commerce", size: "1000-5000 employees", url: "https://zepto.com" },
      { name: "Blinkit", industry: "Instant Delivery", size: "1000-5000 employees", url: "https://blinkit.com" },
      { name: "Slice", industry: "Digital Banking", size: "500-1000 employees", url: "https://sliceit.com" },
      { name: "Cashfree Payments", industry: "Payment Gateway", size: "500-1000 employees", url: "https://cashfree.com" },
      { name: "Jupiter Money", industry: "Neobanking", size: "200-500 employees", url: "https://jupiter.money" },
      { name: "CleverTap", industry: "Customer Engagement SaaS", size: "500-1000 employees", url: "https://clevertap.com" },
      { name: "InMobi", industry: "AdTech & AI", size: "1000-5000 employees", url: "https://inmobi.com" },
      { name: "Lenskart", industry: "Eyewear & Omnichannel", size: "5000+ employees", url: "https://lenskart.com" },
      { name: "Spinny", industry: "AutoTech E-commerce", size: "1000-5000 employees", url: "https://spinny.com" },
      { name: "CarDekho", industry: "Auto Portal", size: "1000-5000 employees", url: "https://cardekho.com" },
      { name: "PharmEasy", industry: "Health & Pharmacy", size: "1000-5000 employees", url: "https://pharmeasy.in" },
      { name: "Cars24", industry: "AutoTech Marketplace", size: "5000+ employees", url: "https://cars24.com" },
      { name: "PolicyBazaar", industry: "InsurTech", size: "5000+ employees", url: "https://policybazaar.com" },
      { name: "Delhivery", industry: "Logistics & Supply Chain", size: "10000+ employees", url: "https://delhivery.com" }
    ];

    const rolesPool = [
      { title: "Senior React Developer", category: "Engineering", type: "Full-time", level: "Senior Level", minSal: 22, maxSal: 34, skills: ["React", "TypeScript", "Redux", "Tailwind CSS", "Jest"] },
      { title: "Staff Backend Architect", category: "Engineering", type: "Full-time", level: "Lead / Staff", minSal: 42, maxSal: 62, skills: ["Node.js", "Go", "Kubernetes", "Kafka", "System Design", "AWS"] },
      { title: "UI/UX Product Designer", category: "Design", type: "Full-time", level: "Mid Level", minSal: 14, maxSal: 22, skills: ["Figma", "Prototyping", "Wireframing", "User Research", "Design Systems"] },
      { title: "DevOps Engineer (Kubernetes & Terraform)", category: "DevOps & Cloud", type: "Remote", level: "Mid Level", minSal: 18, maxSal: 28, skills: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD"] },
      { title: "Machine Learning Researcher", category: "Data & AI", type: "Full-time", level: "Senior Level", minSal: 30, maxSal: 48, skills: ["Python", "PyTorch", "NLP", "LLMs", "HuggingFace"] },
      { title: "Technical Product Manager", category: "Product", type: "Full-time", level: "Mid Level", minSal: 20, maxSal: 32, skills: ["Product Management", "Roadmapping", "SQL", "APIs", "Agile"] },
      { title: "Junior React Native Developer", category: "Engineering", type: "Full-time", level: "Entry Level", minSal: 7, maxSal: 12, skills: ["React Native", "JavaScript", "Mobile App Development", "Redux"] },
      { title: "Cloud Security Specialist", category: "DevOps & Cloud", type: "Full-time", level: "Senior Level", minSal: 26, maxSal: 38, skills: ["Cloud Security", "AWS", "Penetration Testing", "Compliance"] },
      { title: "Data Scientist (Customer Analytics)", category: "Data & AI", type: "Full-time", level: "Mid Level", minSal: 16, maxSal: 26, skills: ["Python", "SQL", "Scikit-Learn", "Tableau", "Pandas"] },
      { title: "Site Reliability Engineer", category: "DevOps & Cloud", type: "Remote", level: "Senior Level", minSal: 24, maxSal: 36, skills: ["Linux", "Prometheus", "Grafana", "Go", "Python", "Incident Management"] },
      { title: "Full-Stack Engineer (Vue / Python)", category: "Engineering", type: "Part-time", level: "Mid Level", minSal: 12, maxSal: 18, skills: ["Vue.js", "Python", "FastAPI", "PostgreSQL"] },
      { title: "Software Development Engineer Intern", category: "Engineering", type: "Internship", level: "Entry Level", minSal: 6, maxSal: 9, skills: ["JavaScript", "Python", "Data Structures", "Git"] },
      { title: "Engineering Manager (Payments)", category: "Engineering", type: "Full-time", level: "Director", minSal: 50, maxSal: 75, skills: ["Leadership", "System Architecture", "Hiring", "FinTech", "Agile"] },
      { title: "Frontend Performance Engineer", category: "Engineering", type: "Full-time", level: "Senior Level", minSal: 25, maxSal: 38, skills: ["React", "Web Vitals", "TypeScript", "Bundle Optimization"] },
      { title: "Senior Data Platform Engineer", category: "Data & AI", type: "Full-time", level: "Senior Level", minSal: 28, maxSal: 44, skills: ["Apache Spark", "Kafka", "Snowflake", "Python", "Airflow"] },
      { title: "Growth & Product Marketing Lead", category: "Marketing", type: "Full-time", level: "Senior Level", minSal: 22, maxSal: 34, skills: ["Growth Strategy", "Conversion Optimization", "SEO", "Analytics"] }
    ];

    let extraIndex = 0;
    while (jobsData.length < 52) {
      const comp = companies[extraIndex % companies.length];
      const role = rolesPool[extraIndex % rolesPool.length];
      const loc = role.type === 'Remote' ? 'Remote' : cities[extraIndex % cities.length];
      
      jobsData.push({
        title: `${role.title}`,
        company: comp.name,
        logo_url: `https://images.unsplash.com/photo-${1510000000000 + (extraIndex * 123456) % 10000000000}?w=128&auto=format&fit=crop&q=80`,
        location: loc,
        job_type: role.type,
        experience_level: role.level,
        salary_min: role.minSal,
        salary_max: role.maxSal,
        category: role.category,
        skills: role.skills,
        description: `Join ${comp.name} as a ${role.title}. Help us innovate in ${comp.industry} by solving high-scale technical challenges and delivering world-class software.`,
        requirements: JSON.stringify([
          `Demonstrated proficiency in ${role.skills.slice(0, 3).join(', ')}`,
          "Strong communication and collaborative problem-solving skills",
          "Passion for shipping user-facing software that delights customers",
          "Experience working in rapid iterative sprint cycles"
        ]),
        responsibilities: JSON.stringify([
          `Deliver critical features for ${comp.name}'s flagship digital platforms`,
          "Partner with cross-functional product, design, and operations teams",
          "Maintain high standards for test coverage, performance, and documentation",
          "Contribute to team architectural discussions and technical roadmap planning"
        ]),
        benefits: JSON.stringify(["Comprehensive Health Coverage", "Flexible Work Setup", "Performance Incentives", "Learning Budget"]),
        company_website: comp.url,
        company_size: comp.size,
        industry: comp.industry,
        is_featured: extraIndex % 4 === 0 ? 1 : 0
      });
      extraIndex++;
    }

    const insertJob = db.prepare(`
      INSERT INTO jobs (
        title, company, logo_url, location, job_type, experience_level,
        salary_min, salary_max, description, requirements, responsibilities,
        skills, benefits, company_website, company_size, industry, is_featured, category, posted_at
      ) VALUES (
        @title, @company, @logo_url, @location, @job_type, @experience_level,
        @salary_min, @salary_max, @description, @requirements, @responsibilities,
        @skills, @benefits, @company_website, @company_size, @industry, @is_featured, @category,
        datetime('now', '-' || @daysAgo || ' days')
      )
    `);

    const insertManyJobs = db.transaction((list) => {
      list.forEach((j, index) => {
        insertJob.run({
          ...j,
          skills: JSON.stringify(j.skills),
          daysAgo: (index % 25)
        });
      });
    });

    insertManyJobs(jobsData);
    console.log(`Seeded ${jobsData.length} realistic jobs successfully.`);
  }

  // Seed demo user
  const demoEmail = 'demo@careerflow.com';
  let demoUser = db.prepare('SELECT * FROM users WHERE email = ?').get(demoEmail);

  if (!demoUser) {
    console.log('Seeding demo user...');
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Demo@1234', salt);

    const userResult = db.prepare(`
      INSERT INTO users (email, password_hash, name)
      VALUES (?, ?, ?)
    `).run(demoEmail, passwordHash, 'Rajveer Sharma');

    const userId = userResult.lastInsertRowid;

    // Insert demo profile
    db.prepare(`
      INSERT INTO profiles (
        user_id, phone, location, headline, bio,
        avatar_url, skills, github_url, linkedin_url, portfolio_url,
        preferred_roles, preferred_locations, preferred_job_types,
        expected_salary_min, expected_salary_max, open_to_remote
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      '+91 98765 43210',
      'Bengaluru, Karnataka',
      'Senior Full-Stack Engineer | React & Node.js Specialist',
      'Passionate full-stack developer with 5+ years of experience architecting high-scale distributed web applications and modern reactive frontends.',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
      JSON.stringify(["React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "PostgreSQL", "Docker", "REST API", "System Design"]),
      'https://github.com/demo-rajveer',
      'https://linkedin.com/in/demo-rajveer',
      'https://careerflow.dev/rajveer',
      JSON.stringify(["Full-Stack Engineer", "Senior Frontend Engineer", "Software Engineer II"]),
      JSON.stringify(["Bengaluru", "Remote", "Pune"]),
      JSON.stringify(["Full-time", "Remote"]),
      20,
      38,
      1
    );

    // Insert education
    db.prepare(`
      INSERT INTO education (user_id, institution, degree, field_of_study, start_year, end_year, grade, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      'National Institute of Technology (NIT)',
      'Bachelor of Technology (B.Tech)',
      'Computer Science and Engineering',
      2018,
      2022,
      '8.8 CGPA',
      'Specialized in Software Engineering, Algorithms, and Distributed Computing. Lead organizer of the annual technical hackathon.'
    );

    // Insert experience
    db.prepare(`
      INSERT INTO experience (user_id, company, role, location, start_date, end_date, is_current, description, skills_used)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      'TechSpire Solutions',
      'Software Engineer II',
      'Bengaluru',
      '2022-07-01',
      '',
      1,
      'Architected micro-frontend architecture for merchant portal, reducing bundle size by 40% and improving Core Web Vitals to 95+ score.',
      JSON.stringify(["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"])
    );

    db.prepare(`
      INSERT INTO experience (user_id, company, role, location, start_date, end_date, is_current, description, skills_used)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      'InnovateHub Labs',
      'Frontend Development Intern',
      'Remote',
      '2021-06-01',
      '2022-05-30',
      0,
      'Built responsive dashboard widgets, reusable design system components, and automated unit testing suites using Jest.',
      JSON.stringify(["JavaScript", "React", "Tailwind CSS", "Jest"])
    );

    // Insert notifications prefs
    db.prepare(`
      INSERT INTO notifications_prefs (user_id, email_job_alerts, email_application_updates, email_weekly_digest, in_app_notifications)
      VALUES (?, 1, 1, 1, 1)
    `).run(userId);

    // Insert collections
    const col1 = db.prepare(`INSERT INTO collections (user_id, name, color) VALUES (?, ?, ?)`).run(userId, 'Dream Companies', '#6366f1').lastInsertRowid;
    const col2 = db.prepare(`INSERT INTO collections (user_id, name, color) VALUES (?, ?, ?)`).run(userId, 'Apply Later', '#10b981').lastInsertRowid;
    const col3 = db.prepare(`INSERT INTO collections (user_id, name, color) VALUES (?, ?, ?)`).run(userId, 'High Compensation', '#f59e0b').lastInsertRowid;

    // Fetch sample jobs for saved & applied
    const allJobs = db.prepare('SELECT id FROM jobs LIMIT 12').all();

    if (allJobs.length >= 6) {
      // Saved jobs
      db.prepare(`
        INSERT INTO saved_jobs (user_id, job_id, collection_id, note)
        VALUES (?, ?, ?, ?)
      `).run(userId, allJobs[0].id, col1, 'Reviewed engineering blog - their architecture aligns with my experience.');

      db.prepare(`
        INSERT INTO saved_jobs (user_id, job_id, collection_id, note)
        VALUES (?, ?, ?, ?)
      `).run(userId, allJobs[1].id, col1, 'Need to refresh Next.js 14 server components before applying.');

      db.prepare(`
        INSERT INTO saved_jobs (user_id, job_id, collection_id, note)
        VALUES (?, ?, ?, ?)
      `).run(userId, allJobs[2].id, col3, 'Competitive compensation package with high equity grant.');

      db.prepare(`
        INSERT INTO saved_jobs (user_id, job_id, collection_id, note)
        VALUES (?, ?, ?, ?)
      `).run(userId, allJobs[3].id, col2, 'Bookmark for next week after portfolio update.');

      // Applications with status workflow
      // 1. Applied
      const app1 = db.prepare(`
        INSERT INTO applications (user_id, job_id, status, cover_letter, notes, applied_at)
        VALUES (?, ?, 'Applied', ?, ?, datetime('now', '-3 days'))
      `).run(
        userId,
        allJobs[4].id,
        'I am excited to apply for this role. With my background in React and microservices, I can hit the ground running.',
        'Submitted application through portal.'
      ).lastInsertRowid;

      db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Applied', 'Application submitted successfully', datetime('now', '-3 days'))`).run(app1);

      // 2. Under Review
      const app2 = db.prepare(`
        INSERT INTO applications (user_id, job_id, status, cover_letter, notes, applied_at)
        VALUES (?, ?, 'Under Review', ?, ?, datetime('now', '-7 days'))
      `).run(
        userId,
        allJobs[5].id,
        'Strong alignment with technical requirements in scalable backend systems.',
        'Recruiter reached out on LinkedIn saying profile was shortlisted.'
      ).lastInsertRowid;

      db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Applied', 'Application submitted', datetime('now', '-7 days'))`).run(app2);
      db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Under Review', 'Resume passed initial screening by HR team', datetime('now', '-5 days'))`).run(app2);

      // 3. Interview
      if (allJobs.length >= 7) {
        const app3 = db.prepare(`
          INSERT INTO applications (user_id, job_id, status, cover_letter, notes, interview_date, interview_time, meeting_link, applied_at)
          VALUES (?, ?, 'Interview', ?, ?, ?, ?, ?, datetime('now', '-12 days'))
        `).run(
          userId,
          allJobs[6].id,
          'Passionate about building customer-centric developer platforms.',
          'Technical architecture round scheduled with Director of Engineering.',
          '2026-10-24',
          '15:00',
          'https://meet.google.com/abc-wxyz-cfw'
        ).lastInsertRowid;

        db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Applied', 'Initial submission', datetime('now', '-12 days'))`).run(app3);
        db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Under Review', 'Hiring manager review', datetime('now', '-9 days'))`).run(app3);
        db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Interview', 'Technical round scheduled', datetime('now', '-3 days'))`).run(app3);
      }

      // 4. Offer
      if (allJobs.length >= 8) {
        const app4 = db.prepare(`
          INSERT INTO applications (user_id, job_id, status, cover_letter, notes, applied_at)
          VALUES (?, ?, 'Offer', ?, ?, datetime('now', '-20 days'))
        `).run(
          userId,
          allJobs[7].id,
          'Experienced in high-throughput transactional payment systems.',
          'Offer letter received! Base: 32 LPA + 8 LPA joining bonus + ESOPs. Evaluating with family.'
        ).lastInsertRowid;

        db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Applied', 'Applied via referral', datetime('now', '-20 days'))`).run(app4);
        db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Under Review', 'Recruiter phone screen passed', datetime('now', '-16 days'))`).run(app4);
        db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Interview', 'Completed 3 rounds of system design & coding', datetime('now', '-8 days'))`).run(app4);
        db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Offer', 'Formal offer letter extended', datetime('now', '-2 days'))`).run(app4);
      }

      // 5. Rejected
      if (allJobs.length >= 9) {
        const app5 = db.prepare(`
          INSERT INTO applications (user_id, job_id, status, cover_letter, notes, applied_at)
          VALUES (?, ?, 'Rejected', ?, ?, datetime('now', '-25 days'))
        `).run(
          userId,
          allJobs[8].id,
          'Specialist in microservices and platform observability.',
          'Position filled internally. Encouraged to apply again in 6 months.'
        ).lastInsertRowid;

        db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Applied', 'Applied on company careers portal', datetime('now', '-25 days'))`).run(app5);
        db.prepare(`INSERT INTO application_events (application_id, status, notes, created_at) VALUES (?, 'Rejected', 'Role closed / filled internally', datetime('now', '-18 days'))`).run(app5);
      }
    }

    console.log('Demo user seeded successfully (demo@careerflow.com / Demo@1234).');
  }

  // Seed Stage 2 (Career Path & Resumes)
  const seedStage2 = require('./seedStage2');
  seedStage2();

  console.log('--- CareerFlow Database Seeding Complete ---');
}

// Allow standalone run: node src/db/seed.js
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
