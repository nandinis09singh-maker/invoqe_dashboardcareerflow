const request = require('supertest');
const app = require('../src/index');

describe('Mock Interview API Endpoints (/api/interviews)', () => {
  let authCookie = null;
  let createdInterviewId = null;

  beforeAll(async () => {
    // Log in demo user to get valid session
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'demo@careerflow.com',
        password: 'Demo@1234'
      });

    expect(res.status).toBe(200);
    const cookies = res.headers['set-cookie'];
    authCookie = cookies.find(c => c.startsWith('careerflow_token='));
  });

  describe('POST /api/interviews/generate', () => {
    it('should generate 5 tailored interview questions for Frontend Developer', async () => {
      const res = await request(app)
        .post('/api/interviews/generate')
        .set('Cookie', [authCookie])
        .send({
          role: 'frontend-developer',
          role_title: 'Frontend Developer',
          interview_type: 'Technical',
          experience_level: 'Mid'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.questions)).toBe(true);
      expect(res.body.questions.length).toBe(5);
      expect(res.body.questions[0].question).toBeDefined();
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app)
        .post('/api/interviews/generate')
        .send({ role: 'frontend-developer' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/interviews/evaluate-answer', () => {
    it('should evaluate a candidate answer and return score with feedback', async () => {
      const res = await request(app)
        .post('/api/interviews/evaluate-answer')
        .set('Cookie', [authCookie])
        .send({
          question: 'Explain Virtual DOM in React.',
          userAnswer: 'The Virtual DOM is a lightweight copy of the real DOM in memory. React uses a diffing algorithm and fiber batching to minimize layout repaints.',
          keyConcepts: ['diffing algorithm', 'fiber architecture', 'batching'],
          idealAnswer: 'React maintains a Virtual DOM tree...'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.score).toBeGreaterThanOrEqual(60);
      expect(Array.isArray(res.body.strengths)).toBe(true);
      expect(Array.isArray(res.body.improvements)).toBe(true);
    });
  });

  describe('POST /api/interviews/save and GET /history', () => {
    it('should save a completed mock interview session and list it in history', async () => {
      const saveRes = await request(app)
        .post('/api/interviews/save')
        .set('Cookie', [authCookie])
        .send({
          role: 'frontend-developer',
          role_title: 'Frontend Developer',
          interview_type: 'Technical',
          experience_level: 'Mid',
          overall_score: 85,
          technical_score: 88,
          communication_score: 82,
          problem_solving_score: 84,
          confidence_score: 86,
          questions: [
            { id: 1, question: 'Sample Q1', userAnswer: 'Sample A1', score: 85 }
          ],
          summary_feedback: 'Strong performance on technical concepts.'
        });

      expect(saveRes.status).toBe(201);
      expect(saveRes.body.success).toBe(true);
      expect(saveRes.body.interview_id).toBeDefined();
      createdInterviewId = saveRes.body.interview_id;

      // Check history
      const histRes = await request(app)
        .get('/api/interviews/history')
        .set('Cookie', [authCookie]);

      expect(histRes.status).toBe(200);
      expect(histRes.body.success).toBe(true);
      expect(Array.isArray(histRes.body.sessions)).toBe(true);
      expect(histRes.body.sessions.some(s => s.id === createdInterviewId)).toBe(true);
    });

    it('should fetch session details by ID', async () => {
      if (!createdInterviewId) return;

      const res = await request(app)
        .get(`/api/interviews/${createdInterviewId}`)
        .set('Cookie', [authCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.session.overall_score).toBe(85);
      expect(Array.isArray(res.body.session.questions)).toBe(true);
    });
  });
});
