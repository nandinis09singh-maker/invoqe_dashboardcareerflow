const request = require('supertest');
const app = require('../src/index');
const db = require('../src/db/database');

describe('Applications API Endpoints (/api/applications)', () => {
  let authCookie = null;
  let testUserId = null;
  let createdAppId = null;
  let sampleJob = null;

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
    testUserId = res.body.user.id;

    // Pick a job that the user hasn't applied for yet
    const unappliedJob = db.prepare(`
      SELECT j.id, j.title, j.company FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id AND a.user_id = ?
      WHERE a.id IS NULL
      LIMIT 1
    `).get(testUserId);

    sampleJob = unappliedJob || { id: 1, title: 'Engineer', company: 'TechCorp' };
  });

  afterAll(() => {
    // Clean up created test application
    if (createdAppId) {
      try {
        db.prepare('DELETE FROM application_events WHERE application_id = ?').run(createdAppId);
        db.prepare('DELETE FROM applications WHERE id = ?').run(createdAppId);
      } catch (e) {}
    }
  });

  describe('GET /api/applications', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/applications');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return applications array for authenticated user', async () => {
      const res = await request(app)
        .get('/api/applications')
        .set('Cookie', [authCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.applications)).toBe(true);
    });
  });

  describe('POST /api/jobs/:id/apply', () => {
    it('should submit a job application and return application_id', async () => {
      const res = await request(app)
        .post(`/api/jobs/${sampleJob.id}/apply`)
        .set('Cookie', [authCookie])
        .send({
          cover_letter: 'I am excited to apply for this position via CareerFlow tests.',
          notes: 'Test application notes'
        });

      expect([201, 409]).toContain(res.status);
      if (res.status === 201) {
        expect(res.body.success).toBe(true);
        expect(res.body.application_id).toBeDefined();
        createdAppId = res.body.application_id;
      }
    });

    it('should prevent duplicate applications to the same job', async () => {
      const res = await request(app)
        .post(`/api/jobs/${sampleJob.id}/apply`)
        .set('Cookie', [authCookie])
        .send({
          cover_letter: 'Duplicate attempt'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already applied/i);
    });
  });

  describe('PATCH /api/applications/:id', () => {
    it('should update application status and create timeline event', async () => {
      // Find an application for this user
      const appRecord = db.prepare('SELECT id, status FROM applications WHERE user_id = ? LIMIT 1').get(testUserId);
      expect(appRecord).toBeDefined();

      const newStatus = appRecord.status === 'Interview' ? 'Offer' : 'Interview';

      const res = await request(app)
        .patch(`/api/applications/${appRecord.id}`)
        .set('Cookie', [authCookie])
        .send({
          status: newStatus,
          notes: 'Updated status via Jest automated test suite',
          interview_date: '2026-11-01',
          interview_time: '14:00'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.application.status).toBe(newStatus);
      expect(res.body.application.timeline.length).toBeGreaterThan(0);
    });
  });
});
