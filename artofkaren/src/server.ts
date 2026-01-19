import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import { testConnection } from './config/database';
import logger from './config/logger';
import { errorHandler, notFound } from './middleware/errorHandler';
import passport, { configurePassport } from './config/passport';

import authRoutes from './routes/authRoutes';
import artworkRoutes from './routes/artworkRoutes';
import blogRoutes from './routes/blogRoutes';
import videoRoutes from './routes/videoRoutes';

dotenv.config();
configurePassport();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3002'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/public', express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res) => {
  res.json({
    message: 'Art of Karen API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      artworks: '/api/artworks',
      blog: '/api/blog',
      videos: '/api/videos'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/videos', videoRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    const dbConnected = await testConnection();

    if (!dbConnected) {
      logger.error('Failed to connect to database. Server not started.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API URL: http://localhost:${PORT}`);
      logger.info(`🎨 Art of Karen Platform Ready!`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
