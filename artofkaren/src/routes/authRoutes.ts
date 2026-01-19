import { Router, Response, Request } from 'express';
import { validationResult } from 'express-validator';
import authService from '../services/authService';
import { authenticate, AuthRequest } from '../middleware/auth';
import { registerValidator, loginValidator } from '../middleware/validator';
import logger from '../config/logger';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', registerValidator, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await authService.register(req.body);
    logger.info(`New user registered: ${req.body.email}`);

    res.status(201).json(result);
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Registration failed'
    });
  }
});

router.post('/login', loginValidator, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await authService.login(req.body);
    logger.info(`User logged in: ${req.body.email}`);

    res.json(result);
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Login failed'
    });
  }
});

router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await authService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Profile not found'
    });
  }
});

router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await authService.updateProfile(req.user.id, req.body);
    logger.info(`Profile updated: ${req.user.email}`);

    res.json(profile);
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Profile update failed'
    });
  }
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CORS_ORIGIN?.split(',')[0]}/login?error=oauth_failed`
  }),
  (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      if (!user) {
        return res.redirect(`${process.env.CORS_ORIGIN?.split(',')[0]}/login?error=no_user`);
      }

      // Generate JWT token
      const secret = process.env.JWT_SECRET || 'fallback_secret';
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:4001';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      logger.error('Google callback error:', error);
      res.redirect(`${process.env.CORS_ORIGIN?.split(',')[0]}/login?error=callback_failed`);
    }
  }
);

export default router;
