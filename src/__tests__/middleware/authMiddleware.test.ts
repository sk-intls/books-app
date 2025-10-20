import { Context, Next } from 'koa';
import * as jwt from 'jsonwebtoken';
import { authenticateToken } from '../../middleware/authMiddleware';
import * as authUtils from '../../utils/auth';

jest.mock('../../utils/auth');

describe('authenticateToken middleware', () => {
  let ctx: Partial<Context>;
  let next: jest.MockedFunction<Next>;
  let mockGetJwtSecret: jest.MockedFunction<typeof authUtils.getJwtSecret>;

  const SECRET = 'test-jwt-secret';
  const validPayload = { id: 1, username: 'testuser' };

  beforeEach(() => {
    ctx = {
      headers: {},
      status: undefined,
      body: undefined,
      state: {}
    };
    next = jest.fn().mockResolvedValue(undefined);
    mockGetJwtSecret = authUtils.getJwtSecret as jest.MockedFunction<typeof authUtils.getJwtSecret>;
    
    mockGetJwtSecret.mockReturnValue(SECRET);
    jest.clearAllMocks();
  });

  it('should authenticate valid token and call next', async () => {
    const token = jwt.sign(validPayload, SECRET);
    ctx.headers = {
      authorization: `Bearer ${token}`
    };

    await authenticateToken(ctx as Context, next);

    expect(ctx.state?.user).toMatchObject(validPayload);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should return 401 when no token provided', async () => {
    ctx.headers = {};

    await authenticateToken(ctx as Context, next);

    expect(ctx.status).toBe(401);
    expect(ctx.body).toEqual({ error: 'Access token required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 for invalid token', async () => {
    ctx.headers = {
      authorization: 'Bearer invalid-token'
    };

    await authenticateToken(ctx as Context, next);

    expect(ctx.status).toBe(403);
    expect(ctx.body).toEqual({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 for expired token', async () => {
    const expiredToken = jwt.sign(validPayload, SECRET, { expiresIn: '-1s' });
    ctx.headers = {
      authorization: `Bearer ${expiredToken}`
    };

    await authenticateToken(ctx as Context, next);

    expect(ctx.status).toBe(403);
    expect(ctx.body).toEqual({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });
});
