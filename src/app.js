import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'mongo-sanitize';
import env from './config/env.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: env.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
app.use(globalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sanitization - mongo-sanitize exports a sanitizer, not middleware
app.use((req, res, next) => {
    if (req.body) mongoSanitize(req.body);
    if (req.query) mongoSanitize(req.query);
    if (req.params) mongoSanitize(req.params);
    next();
});

// Logging
if (env.nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/sessions', sessionRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
