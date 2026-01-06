import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import type { Express, RequestHandler } from 'express';

// Define user type for authenticated users
export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  picture?: string;
}

// Extend Express types
declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
  }
}

/**
 * Get list of allowed admin emails from environment variable.
 */
function getAllowedEmails(): string[] {
  const emails = process.env.ALLOWED_ADMIN_EMAILS || '';
  return emails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

/**
 * Check if email is in the allowed list.
 */
export function isAllowedEmail(email: string): boolean {
  const allowedEmails = getAllowedEmails();
  // If no emails configured, deny all access
  if (allowedEmails.length === 0) {
    console.warn('ALLOWED_ADMIN_EMAILS not configured - admin access denied');
    return false;
  }
  return allowedEmails.includes(email.toLowerCase());
}

/**
 * Setup authentication middleware and passport strategies.
 */
export function setupAuth(app: Express): void {
  // Create memory store for sessions
  const MemoryStore = createMemoryStore(session);

  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000, // Prune expired entries every 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
      },
    })
  );

  // Trust first proxy (GCP load balancer)
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Only configure Google strategy if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL:
            process.env.GOOGLE_CALLBACK_URL ||
            'http://localhost:3000/api/auth/google/callback',
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;

            if (!email) {
              return done(null, false, { message: 'No email found in profile' });
            }

            // Check if email is in the allowed list
            if (!isAllowedEmail(email)) {
              console.log(`Access denied for email: ${email}`);
              return done(null, false, { message: 'Email not authorized' });
            }

            // Create authenticated user object
            const user: AuthenticatedUser = {
              id: profile.id,
              email: email,
              displayName: profile.displayName,
              picture: profile.photos?.[0]?.value,
            };

            console.log(`User authenticated: ${email}`);
            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  } else {
    console.warn('Google OAuth not configured - admin login disabled');
  }

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user: AuthenticatedUser, done) => {
    done(null, user);
  });
}

/**
 * Middleware to check if user is authenticated.
 * Returns 401 if not authenticated.
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    error: 'Unauthorized',
    authenticated: false,
    loginUrl: '/api/auth/google',
  });
};
