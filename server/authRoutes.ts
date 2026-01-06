import { Router, Request, Response } from 'express';
import passport from 'passport';
import { AuthenticatedUser, requireAuth } from './auth';

const router = Router();

// Initiate Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account', // Always show account selector
  })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/admin/login?error=unauthorized',
    failureMessage: true,
  }),
  (_req: Request, res: Response) => {
    // Successful authentication, redirect to admin dashboard
    res.redirect('/admin');
  }
);

// Check authentication status
router.get('/status', (req: Request, res: Response) => {
  if (req.isAuthenticated() && req.user) {
    const user = req.user as AuthenticatedUser;
    res.json({
      authenticated: true,
      user: {
        email: user.email,
        displayName: user.displayName,
        picture: user.picture,
      },
    });
  } else {
    res.json({
      authenticated: false,
    });
  }
});

// Get current user info (protected)
router.get('/me', requireAuth, (req: Request, res: Response) => {
  const user = req.user as AuthenticatedUser;
  res.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    picture: user.picture,
  });
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });
});

export default router;
