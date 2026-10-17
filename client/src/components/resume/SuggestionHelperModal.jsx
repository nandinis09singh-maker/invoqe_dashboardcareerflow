import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Sparkles, Search, Plus, Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_SUGGESTIONS = {
  'frontend-developer': {
    title: 'Frontend Developer',
    summaries: [
      'High-performing Frontend Engineer with 4+ years of expertise in React, TypeScript, and modern state architecture. Proven track record of optimizing Core Web Vitals to sub-second load times and scaling accessible design systems across distributed cross-functional teams.',
      'User-centric Frontend Specialist passionate about building buttery-smooth web experiences. Adept at Next.js, Framer Motion, and Tailwind CSS with a strong eye for micro-interactions, responsive typography, and WCAG AA accessibility compliance.',
      'Results-oriented Web Application Developer focused on modern frontend tooling, component-driven development, and automated testing with Vitest/Cypress. Decreased bounce rates by 28% through interactive UI refactoring.'
    ],
    bullets: [
      { tag: 'Performance', text: 'Architected client-side caching and dynamic code-splitting strategy in Vite/React, slashing First Contentful Paint (FCP) by 42% across 200k+ daily active users.' },
      { tag: 'Design System', text: 'Authored modular atomic design system in Tailwind CSS and Storybook, eliminating UI inconsistencies and accelerating engineering team feature shipping velocity by 35%.' },
      { tag: 'Architecture', text: 'Spearheaded migration of legacy jQuery application to React 18 with TypeScript and Zustand, reducing technical debt tickets by 60%.' },
      { tag: 'Accessibility', text: 'Conducted rigorous WCAG 2.1 AA accessibility audit and remediation, achieving 100% Lighthouse Accessibility scores across key consumer purchase funnels.' },
      { tag: 'State & Data', text: 'Engineered optimistic UI updates and real-time WebSocket listeners, elevating perceived application latency and boosting user workflow satisfaction score to 94%.' },
      { tag: 'Testing', text: 'Configured end-to-end Cypress test suites and CI GitHub Actions, improving test coverage from 35% to 88% and eliminating regression leaks into production.' }
    ]
  },
  'backend-developer': {
    title: 'Backend Developer',
    summaries: [
      'Backend Systems Engineer specializing in distributed microservices, high-throughput REST/GraphQL APIs, and resilient relational database modeling. Experienced in Node.js, Go, PostgreSQL, and Redis caching layers.',
      'API & Infrastructure Engineer with a deep foundation in concurrent processing, data consistency, and transactional integrity. Successfully scaled backend architectures from zero to 10M+ daily events.',
      'Backend Software Engineer passionate about developer ergonomics, zero-downtime database migrations, and telemetry-driven performance optimization using OpenTelemetry and Prometheus.'
    ],
    bullets: [
      { tag: 'Scalability', text: 'Designed and deployed distributed Redis caching layer and connection pooling, cutting median database read query latency from 180ms to 12ms.' },
      { tag: 'APIs', text: 'Engineered robust GraphQL and RESTful APIs serving 15,000 requests/second with 99.99% uptime and zero-downtime blue/green deployment pipelines.' },
      { tag: 'Security', text: 'Implemented cryptographically secure JWT authentication with rotating refresh tokens, rate limiting, and RBAC authorization protocols.' },
      { tag: 'Database', text: 'Optimized complex SQL queries with composite indexing and query plan analysis, lowering cloud database compute utilization costs by 32%.' },
      { tag: 'Reliability', text: 'Constructed asynchronous background worker system utilizing BullMQ and Redis to process heavy image compression and PDF exports without blocking main HTTP threads.' },
      { tag: 'Integrations', text: 'Integrated Stripe Checkout, Webhooks, and automatic subscription reconciliation handling over $4M in processed annual gross merchandise volume.' }
    ]
  },
  'full-stack-developer': {
    title: 'Full-Stack Developer',
    summaries: [
      'Versatile Full-Stack Engineer adept across the entire software development lifecycle, from intuitive React user interfaces to scalable Node.js microservices and automated Docker deployments.',
      'Product-minded Full-Stack Developer bridging design sensibilities with bulletproof systems programming. Strong background in TypeScript, React, Express, PostgreSQL, and cloud deployments.',
      'Senior Full-Stack Engineer with a track record of driving zero-to-one product launches. Skilled in rapid prototyping, clean domain modeling, and maintainable architectural patterns.'
    ],
    bullets: [
      { tag: 'Full-Stack Delivery', text: 'Built and launched core SaaS platform from conception to enterprise delivery in 12 weeks, driving first-year annual recurring revenue (ARR) of $450k.' },
      { tag: 'Performance', text: 'Streamlined end-to-end payload transfers with gzip compression and optimized JSON serialization, decreasing round-trip network payload sizes by 55%.' },
      { tag: 'DevOps', text: 'Dockerized multi-stage microservices and configured automated CI/CD pipelines on GitHub Actions, cutting release deployment cycles from 2 hours to 8 minutes.' },
      { tag: 'Collaboration', text: 'Partnered with Product Managers and UX Designers to translate business requirements into technical specs, reducing feature delivery drift by 40%.' },
      { tag: 'Real-time', text: 'Built real-time collaborative document editor with WebSockets and operational transform primitives, supporting concurrent edits by up to 50 simultaneous team members.' },
      { tag: 'Quality', text: 'Enforced strict TypeScript types, ESLint rules, and Jest unit tests across client and server packages, keeping defect escape rate below 1.2%.' }
    ]
  },
  'data-analyst': {
    title: 'Data Analyst',
    summaries: [
      'Insight-driven Data Analyst with 3+ years translating complex behavioral data into actionable executive strategy. Proficient in Advanced SQL, Python (Pandas/NumPy), Tableau, and automated reporting pipelines.',
      'Business Intelligence Analyst experienced in financial modeling, cohort analysis, and funnel conversion optimization. Adept at storytelling through intuitive dashboards that drive executive consensus.'
    ],
    bullets: [
      { tag: 'Dashboards', text: 'Engineered automated executive BI dashboard in Tableau consolidating 8 disparate data silos, saving 15 manual analytical hours weekly.' },
      { tag: 'Retention', text: 'Uncovered churn friction points via granular customer cohort analysis, recommending onboarding interventions that elevated 90-day retention by 14%.' },
      { tag: 'SQL Modeling', text: 'Wrote advanced recursive CTE queries and window functions in Snowflake/BigQuery, reducing analytical compute overhead by 25%.' },
      { tag: 'A/B Testing', text: 'Designed and evaluated 24 statistical hypothesis A/B tests across web checkout variants, uncovering a high-converting flow that yielded a 9.2% lift in checkout completions.' },
      { tag: 'Data Quality', text: 'Instituted automated dbt testing protocols to validate data integrity across ETL pipelines, decreasing schema mismatch bugs by 90%.' }
    ]
  },
  'data-scientist': {
    title: 'Data Scientist',
    summaries: [
      'Machine Learning Practitioner and Data Scientist experienced in formulating predictive models, NLP transformers, and deploying scalable inference APIs. Proficient in PyTorch, Scikit-Learn, and MLflow.',
      'Applied Data Scientist with a passion for turning unstructured datasets into production recommendation systems and statistical anomalies detectors with measurable business value.'
    ],
    bullets: [
      { tag: 'Machine Learning', text: 'Trained and validated XGBoost churn prediction model on 1.2M customer records, attaining an ROC-AUC of 0.89 and preventing $220k in projected churn.' },
      { tag: 'NLP', text: 'Fine-tuned BERT transformer architecture for sentiment classification and ticket routing, cutting average customer support resolution latency by 3.5 hours.' },
      { tag: 'MLOps', text: 'Packaged ML models into containerized FastAPI microservices and deployed on Kubernetes with Triton Inference Server, handling 200 requests/sec under 50ms.' },
      { tag: 'Feature Engineering', text: 'Devised 40+ domain-specific feature embeddings using TF-IDF and PCA, elevating recommendation engine click-through rate (CTR) by 18%.' }
    ]
  },
  'ui-ux-designer': {
    title: 'UI/UX Designer',
    summaries: [
      'Product Designer with a balanced mastery of user research, wireframing, high-fidelity Figma prototyping, and design systems. Dedicated to creating human-centric, accessible, and delight-driven interfaces.',
      'UI/UX Designer with 4+ years creating frictionless digital experiences across web and mobile. Passionate about design ethics, micro-interactions, and close engineering collaboration.'
    ],
    bullets: [
      { tag: 'User Research', text: 'Conducted 35+ moderated usability interviews and cognitive walkthroughs, generating insights that reshaped core navigation and boosted usability scores by 34%.' },
      { tag: 'Design Systems', text: 'Built unified multi-brand design system in Figma comprising 150+ tokenized components and interactive states, cutting design turnaround times in half.' },
      { tag: 'Conversion', text: 'Redesigned user onboarding flow through wireframing and interactive prototypes, lifting trial-to-paid activation rate from 18% to 29%.' },
      { tag: 'Handoff', text: 'Created comprehensive Figma design tokens and developer handoff specs, eliminating ambiguity and reducing frontend styling rework cycles by 40%.' }
    ]
  },
  'devops-engineer': {
    title: 'DevOps Engineer',
    summaries: [
      'DevOps and Site Reliability Engineer dedicated to immutable infrastructure, resilient CI/CD pipelines, and high availability. Deep hands-on experience in AWS, Kubernetes, Terraform, and GitOps workflows.',
      'Cloud Infrastructure Specialist experienced in designing self-healing, multi-region cloud networks, zero-trust security postures, and cost-optimized compute workloads.'
    ],
    bullets: [
      { tag: 'Infrastructure', text: 'Provisioned multi-region AWS infrastructure (EKS, RDS, S3) using modular Terraform code, enabling complete disaster recovery spin-up in under 20 minutes.' },
      { tag: 'CI/CD', text: 'Engineered GitOps delivery pipeline with ArgoCD and GitHub Actions, facilitating 40+ zero-downtime production deployments per week.' },
      { tag: 'Cost Optimization', text: 'Analyzed AWS cluster compute utilization and implemented spot instances with Karpenter auto-scaling, reducing monthly cloud spend by $14,000 (38%).' },
      { tag: 'Monitoring', text: 'Architected observability stack with Prometheus, Grafana, and Loki, establishing SLIs/SLOs and reducing Mean Time to Resolution (MTTR) by 45%.' }
    ]
  },
  'product-manager': {
    title: 'Product Manager',
    summaries: [
      'Data-driven Technical Product Manager with a proven ability to align cross-functional engineering, design, and executive teams toward shipping high-impact B2B SaaS features.',
      'Customer-focused Product Manager with experience managing entire product lifecycles from discovery and user interviews to PRDs, sprint prioritization, and go-to-market execution.'
    ],
    bullets: [
      { tag: 'Product Strategy', text: 'Defined and executed quarterly product roadmap across 2 agile squads, delivering 5 marquee features on schedule and achieving 115% of annual net revenue target.' },
      { tag: 'Growth', text: 'Identified friction in self-serve onboarding funnel through telemetry analytics, initiating redesign that lifted product-qualified lead (PQL) conversions by 22%.' },
      { tag: 'Prioritization', text: 'Utilized RICE scoring framework to prioritize 120+ backlog items, aligning stakeholder expectations and boosting sprint delivery predictability to 92%.' },
      { tag: 'Customer Discovery', text: 'Led 50+ discovery interviews with enterprise customers, validating product-market fit for a new add-on tier that secured $600k in pipeline within 90 days.' }
    ]
  }
};

export default function SuggestionHelperModal({ isOpen, onClose, onInsert, targetType = 'summary' }) {
  const [selectedRole, setSelectedRole] = useState('frontend-developer');
  const [activeTab, setActiveTab] = useState(targetType === 'summary' ? 'summaries' : 'bullets');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const roleData = ROLE_SUGGESTIONS[selectedRole] || ROLE_SUGGESTIONS['frontend-developer'];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInsert = (text) => {
    if (onInsert) {
      onInsert(text);
      toast.success('Inserted into resume!');
      onClose();
    }
  };

  const filteredBullets = roleData.bullets.filter(
    (b) =>
      b.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSummaries = roleData.summaries.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Content Suggestion Helper"
      subtitle="Select a role and browse battle-tested, high-impact statements written with the Action + Metric + Result formula."
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Top Controls: Role Selection & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Select Role Template
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {Object.entries(ROLE_SUGGESTIONS).map(([slug, data]) => (
                <option key={slug} value={slug}>
                  {data.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Filter By Keyword
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. latency, react, metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Tab Switcher: Summaries vs Bullet Points */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('summaries')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === 'summaries'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Executive Summaries ({roleData.summaries.length})
          </button>
          <button
            onClick={() => setActiveTab('bullets')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === 'bullets'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Action-Driven Bullets ({roleData.bullets.length})
          </button>
        </div>

        {/* Suggestion Items Container */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {activeTab === 'summaries' ? (
            filteredSummaries.length > 0 ? (
              filteredSummaries.map((text, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-brand-400 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {text}
                  </p>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleCopy(text, idx)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
                      title="Copy text"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleInsert(text)}
                      className="text-xs py-1 px-2.5 h-auto flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Insert</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-slate-400">
                No summaries matched your search query.
              </p>
            )
          ) : filteredBullets.length > 0 ? (
            filteredBullets.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-brand-400 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {item.tag}
                  </span>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {item.text}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleCopy(item.text, idx)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
                    title="Copy text"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleInsert(item.text)}
                    className="text-xs py-1 px-2.5 h-auto flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-xs text-slate-400">
              No bullets matched your search query.
            </p>
          )}
        </div>

        {/* Modal Footer Tip */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Click &ldquo;Insert&rdquo; to place directly into your active section.
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
