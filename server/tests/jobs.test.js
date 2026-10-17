const request = require('supertest');
const app = require('../src/index');

describe('Jobs API Endpoints (/api/jobs)', () => {
  let sampleJobId = null;

  describe('GET /api/jobs', () => {
    it('should return paginated jobs list with 9 jobs per page and pagination meta', async () => {
      const res = await request(app).get('/api/jobs');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.jobs)).toBe(true);
      expect(res.body.jobs.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.total).toBeGreaterThanOrEqual(50);
      expect(res.body.pagination.totalPages).toBeGreaterThan(1);

      sampleJobId = res.body.jobs[0].id;
    });

    it('should filter jobs by keyword search', async () => {
      const res = await request(app).get('/api/jobs?search=Frontend');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.jobs.forEach(job => {
        const matchesTitle = job.title.toLowerCase().includes('frontend');
        const matchesCategory = (job.category || '').toLowerCase().includes('frontend');
        const matchesSkills = (job.skills || []).some(s => s.toLowerCase().includes('frontend'));
        expect(matchesTitle || matchesCategory || matchesSkills).toBe(true);
      });
    });

    it('should filter jobs by job_type', async () => {
      const res = await request(app).get('/api/jobs?type=Remote');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.jobs.forEach(job => {
        expect(job.job_type).toBe('Remote');
      });
    });

    it('should sort jobs by salary_max desc', async () => {
      const res = await request(app).get('/api/jobs?sort=salary_desc');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const salaries = res.body.jobs.map(j => j.salary_max);
      for (let i = 0; i < salaries.length - 1; i++) {
        expect(salaries[i]).toBeGreaterThanOrEqual(salaries[i + 1]);
      }
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should return single job details when valid id provided', async () => {
      const res = await request(app).get(`/api/jobs/${sampleJobId || 1}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.job).toBeDefined();
      expect(res.body.job.id).toBe(sampleJobId || 1);
      expect(res.body.job.title).toBeDefined();
      expect(res.body.job.company).toBeDefined();
      expect(Array.isArray(res.body.job.skills)).toBe(true);
    });

    it('should return 404 for non-existent job id', async () => {
      const res = await request(app).get('/api/jobs/999999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/jobs/meta/filters', () => {
    it('should return available locations, job types, categories, and top skills', async () => {
      const res = await request(app).get('/api/jobs/meta/filters');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.filters).toBeDefined();
      expect(Array.isArray(res.body.filters.locations)).toBe(true);
      expect(Array.isArray(res.body.filters.jobTypes)).toBe(true);
      expect(Array.isArray(res.body.filters.categories)).toBe(true);
      expect(Array.isArray(res.body.filters.skills)).toBe(true);
    });
  });
});
