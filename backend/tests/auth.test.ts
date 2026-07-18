import request from 'supertest';

describe('Admin auth', () => {
  const previousEnv = { ...process.env };

  beforeEach(() => {
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/test';
    process.env.ADMIN_EMAIL = 'admin@gmail.com';
    process.env.ADMIN_PASSWORD = 'SuperSecure123!';
    process.env.JWT_SECRET = 'test-secret';
    jest.resetModules();
  });

  afterAll(() => {
    process.env = previousEnv;
  });

  it('returns a JWT for valid admin credentials', async () => {
    const { createApp } = await import('../src/app');
    const app = createApp();

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@gmail.com', password: 'SuperSecure123!' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  it('rejects invalid admin credentials', async () => {
    const { createApp } = await import('../src/app');
    const app = createApp();

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@gmail.com', password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/invalid/i);
  });
});
