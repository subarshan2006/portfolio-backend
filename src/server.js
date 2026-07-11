import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/database.js';
import env from './config/env.js';
import { startCronJobs, stopCronJobs } from './jobs/cronScheduler.js';

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(env.port, () => {
            console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
        });

        startCronJobs();

        const gracefulShutdown = (signal) => {
            console.log(`${signal} received. Starting graceful shutdown...`);
            stopCronJobs();
            server.close(() => {
                console.log('HTTP server closed.');
                process.exit(0);
            });

            setTimeout(() => {
                console.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Rejection:', err.message);
            stopCronJobs();
            server.close(() => process.exit(1));
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
