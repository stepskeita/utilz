import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import morgan from 'morgan';

import helmet from 'helmet';

dotenv.config();

const app = express();

// Middleware to log requests
app.use(morgan('dev')); // Log HTTP requests in development mode

// Dynamic CORS configuration
app.use(cors());

app.use(helmet()); // Add this before other middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true,
  responseOnLimit: 'File size limit exceeded',
  createParentPath: true
}));

// API routes
app.use('/api/v1', routes);

// Handle 404 - Route not found
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);





export default app;