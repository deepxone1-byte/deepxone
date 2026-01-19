import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from './database';
import logger from './logger';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4002/api/auth/google/callback';

export function configurePassport() {
  // Only configure Google OAuth if credentials are provided
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const connection = await pool.getConnection();

            try {
              // Check if user exists with this Google ID
              const [existingUsers]: any = await connection.query(
                'SELECT * FROM users WHERE google_id = ?',
                [profile.id]
              );

              if (existingUsers.length > 0) {
                // User exists, return it
                return done(null, existingUsers[0]);
              }

              // Check if user exists with this email
              const email = profile.emails?.[0]?.value;
              if (email) {
                const [emailUsers]: any = await connection.query(
                  'SELECT * FROM users WHERE email = ?',
                  [email]
                );

                if (emailUsers.length > 0) {
                  // Link Google account to existing user
                  await connection.query(
                    'UPDATE users SET google_id = ?, provider = ? WHERE id = ?',
                    [profile.id, 'google', emailUsers[0].id]
                  );
                  return done(null, emailUsers[0]);
                }
              }

              // Create new user
              const username = profile.emails?.[0]?.value.split('@')[0] || `user_${Date.now()}`;
              const fullName = profile.displayName || 'User';
              const profileImage = profile.photos?.[0]?.value || null;

              const [result]: any = await connection.query(
                `INSERT INTO users (email, username, full_name, google_id, provider, profile_image, is_active, password)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  email || `${username}@gmail.com`,
                  username,
                  fullName,
                  profile.id,
                  'google',
                  profileImage,
                  true,
                  '' // Empty password for OAuth users
                ]
              );

              const newUser = {
                id: result.insertId,
                email: email || `${username}@gmail.com`,
                username,
                full_name: fullName,
                role: 'user',
                google_id: profile.id,
                provider: 'google',
                profile_image: profileImage
              };

              logger.info(`New user created via Google OAuth: ${email}`);
              return done(null, newUser);
            } finally {
              connection.release();
            }
          } catch (error) {
            logger.error('Google OAuth error:', error);
            return done(error as Error);
          }
        }
      )
    );

    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
      try {
        const connection = await pool.getConnection();
        try {
          const [users]: any = await connection.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
          );
          done(null, users[0] || null);
        } finally {
          connection.release();
        }
      } catch (error) {
        done(error);
      }
    });

    logger.info('✅ Google OAuth configured');
  } else {
    logger.warn('⚠️  Google OAuth not configured - missing credentials');
  }
}

export default passport;
