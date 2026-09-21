import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import * as historyService from '../src/services/historyService.js';

// Mock DB persistence layer for API route testing
vi.mock('../src/services/historyService.js', () => ({
  saveScanRecord: vi.fn(async (payload) => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    created_at: new Date().toISOString(),
    ...payload
  })),
  getUserScans: vi.fn(async (userId, options) => ({
    scans: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: userId,
        scan_type: 'url',
        target: 'https://example.com',
        risk_score: 10,
        risk_level: 'LOW',
        status: 'safe',
        created_at: new Date().toISOString()
      }
    ],
    pagination: {
      totalItems: 1,
      currentPage: 1,
      limit: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    }
  })),
  getScanById: vi.fn(async (scanId, userId) => {
    if (scanId === '123e4567-e89b-12d3-a456-426614174000') {
      return {
        id: scanId,
        user_id: userId,
        scan_type: 'url',
        target: 'https://example.com',
        risk_score: 10,
        risk_level: 'LOW',
        status: 'safe'
      };
    }
    return null;
  }),
  deleteScanRecord: vi.fn(async (scanId, userId) => {
    if (scanId === '123e4567-e89b-12d3-a456-426614174000') {
      return { found: true };
    }
    return { found: false };
  })
}));

describe('REST API Endpoints Integration Tests', () => {
  const TEST_USER_ID = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return 200 health check response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('running');
    });
  });

  describe('Authentication Enforcement', () => {
    it('should reject unauthenticated request to protected route with 401', async () => {
      const res = await request(app)
        .post('/api/scans/url')
        .send({ url: 'https://example.com' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('POST /api/scans/url', () => {
    it('should analyze valid URL and return saved scan object', async () => {
      const res = await request(app)
        .post('/api/scans/url')
        .set('x-test-user-id', TEST_USER_ID)
        .send({ url: 'https://example.com' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.scan_type).toBe('url');
      expect(res.body.data.user_id).toBe(TEST_USER_ID);
      expect(historyService.saveScanRecord).toHaveBeenCalledOnce();
    });

    it('should return 400 for invalid URL payload', async () => {
      const res = await request(app)
        .post('/api/scans/url')
        .set('x-test-user-id', TEST_USER_ID)
        .send({ url: '' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/scans/email', () => {
    it('should analyze email content and persist scan result', async () => {
      const res = await request(app)
        .post('/api/scans/email')
        .set('x-test-user-id', TEST_USER_ID)
        .send({
          subject: 'Security Notice',
          content: 'URGENT: Please verify your password immediately at http://192.168.1.1/login',
          sender: 'security@support.com'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.scan_type).toBe('email');
      expect(res.body.data.risk_score).toBeGreaterThan(0);
      expect(historyService.saveScanRecord).toHaveBeenCalledOnce();
    });
  });

  describe('GET /api/scans (History Listing)', () => {
    it('should return paginated history for authenticated user', async () => {
      const res = await request(app)
        .get('/api/scans?page=1&limit=10')
        .set('x-test-user-id', TEST_USER_ID);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(historyService.getUserScans).toHaveBeenCalledWith(TEST_USER_ID, expect.objectContaining({ page: 1, limit: 10 }), 'test-token-mock');
    });
  });

  describe('GET /api/scans/:id', () => {
    it('should return specific scan report if owned by user', async () => {
      const scanId = '123e4567-e89b-12d3-a456-426614174000';
      const res = await request(app)
        .get(`/api/scans/${scanId}`)
        .set('x-test-user-id', TEST_USER_ID);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(scanId);
    });

    it('should return 404 if scan not found or not owned by user', async () => {
      const scanId = '999e4567-e89b-12d3-a456-426614174999';
      const res = await request(app)
        .get(`/api/scans/${scanId}`)
        .set('x-test-user-id', TEST_USER_ID);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/scans/:id', () => {
    it('should delete scan record if owned by user', async () => {
      const scanId = '123e4567-e89b-12d3-a456-426614174000';
      const res = await request(app)
        .delete(`/api/scans/${scanId}`)
        .set('x-test-user-id', TEST_USER_ID);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(historyService.deleteScanRecord).toHaveBeenCalledWith(scanId, TEST_USER_ID, 'test-token-mock');
    });

    it('should reject deletion with 404 if record does not belong to user', async () => {
      const scanId = '999e4567-e89b-12d3-a456-426614174999';
      const res = await request(app)
        .delete(`/api/scans/${scanId}`)
        .set('x-test-user-id', TEST_USER_ID);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
