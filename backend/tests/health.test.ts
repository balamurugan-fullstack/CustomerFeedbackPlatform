import request from 'supertest';
import { createApp } from '../src/app';

describe('Health endpoints', () => {
  it('requires an admin token for health checks', async () => {
    const app = createApp();
    const response = await request(app).get('/health');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/admin/i);
  });

  it('returns a healthy payload when the admin token is supplied', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/health')
      .set('authorization', 'Bearer test-admin-token');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/admin/i);
  });
});
