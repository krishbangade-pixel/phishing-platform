import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import logger from './utils/logger.js';
import { generalLimiter } from './middleware/rateLimitMiddleware.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

import healthRoutes from './routes/healthRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-test-user-id']
  })
);

// General rate limiter
app.use('/api', generalLimiter);

// JSON body parser with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(
    pinoHttp({
      logger,
      customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
          userId: req.raw?.user?.id
        }),
        res: (res) => ({
          statusCode: res.statusCode
        })
      }
    })
  );
}

// Register API Routes
app.use('/api', healthRoutes);
app.use('/api', scanRoutes);
app.use('/api', historyRoutes);

// Fallback & Central Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
