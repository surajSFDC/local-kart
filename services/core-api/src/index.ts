import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/database.js';
import { logger } from './config/logger.js';
import { router as healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { providersRouter } from './routes/providers.js';
import { bookingsRouter } from './routes/bookings.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later'
    }
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(limiter);

// Routes
app.get('/', (_req, res) => {
  res.json({ 
    name: 'LocalKart Core API', 
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/providers', providersRouter);
app.use('/api/bookings', bookingsRouter);

// Socket.io for real-time messaging
io.on('connection', (socket) => {
  logger.info('User connected:', socket.id);

  socket.on('join-booking', (bookingId: string) => {
    socket.join(`booking-${bookingId}`);
    logger.info(`User ${socket.id} joined booking ${bookingId}`);
  });

  socket.on('send-message', async (data: any) => {
    try {
      // Here you would save the message to database
      // For now, just broadcast it
      io.to(`booking-${data.bookingId}`).emit('new-message', {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Socket message error:', error);
      socket.emit('message-error', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    logger.info('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    server.listen(port, () => {
      logger.info(`🚀 LocalKart Core API listening on port ${port}`);
      logger.info(`📱 Socket.io server running`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

