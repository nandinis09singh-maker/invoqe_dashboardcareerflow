const request = require('supertest');
const app = require('../src/index');
const db = require('../src/db/database');

describe('Auth API Endpoints (/api/auth)', () => {
  const testUser = {
    name: 'Test Candidate',
    email: `candidate_${Date.now()}@example.com`,
    password: 'Password@123'
  };

  let authCookie = null;

  afterAll(() => {
    // Clean up test user
    try {
      db.prepare('DELETE FROM users WHERE email = ?').run(testUser.email);
    } catch (e) {}
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully and return user object with profile', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.name).toBe(testUser.name);

      // Verify cookie was set
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      authCookie = cookies.find(c => c.startsWith('careerflow_token='));
      expect(authCookie).toBeDefined();
    });

    it('should reject registration if email is already taken', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Invalid Email User',
          email: 'not-an-email',
          password: 'Password@123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword999'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should log in demo user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@careerflow.com',
          password: 'Demo@1234'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('demo@careerflow.com');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 when no session cookie or token provided', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return user info when valid auth cookie is sent', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [authCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testUser.email);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear the careerflow_token cookie on logout', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
    });
  });
});
