# Engineering Review Document (ERD)
## LocalKart - AI-Powered Local Services Platform

**Version**: 1.0  
**Date**: December 2024  
**Project**: LocalKart (LocalAI Platform)  
**Document Type**: Engineering Review Document  

---

## 1. Executive Summary

This Engineering Review Document provides a comprehensive technical analysis and implementation strategy for the LocalKart platform. It covers system architecture, technology stack, data models, API design, security considerations, and deployment strategies to build a scalable, maintainable, and high-performance platform.

## 2. System Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   Admin Panel   │    │   Mobile App    │
│   (React/TS)    │    │   (React/TS)    │    │   (React Native)│
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      API Gateway          │
                    │    (Express.js + TS)      │
                    └─────────────┬─────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼───────┐    ┌───────────▼───────────┐    ┌────────▼────────┐
│  Auth Service │    │   Core API Service    │    │  AI Service     │
│  (JWT + OAuth)│    │   (Express.js + TS)   │    │  (OpenAI API)   │
└───────────────┘    └───────────┬───────────┘    └─────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      Database Layer       │
                    │    (MongoDB + Redis)      │
                    └───────────────────────────┘
```

### 2.2 Microservices Architecture

The platform follows a microservices architecture with the following services:

1. **Authentication Service** - User management and JWT handling
2. **Core API Service** - Business logic and data management
3. **AI Service** - Profile generation and smart matching
4. **Notification Service** - Real-time messaging and notifications
5. **Payment Service** - Payment processing and billing
6. **Search Service** - Advanced search and filtering

## 3. Technology Stack

### 3.1 Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | React | 18.x | UI framework |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| State Management | Redux Toolkit | 2.x | Global state |
| Routing | React Router | 6.x | Client-side routing |
| HTTP Client | Axios | 1.x | API communication |
| Real-time | Socket.io Client | 4.x | WebSocket communication |
| Maps | Google Maps API | Latest | Location services |
| Charts | Chart.js | 4.x | Analytics visualization |

### 3.2 Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Runtime | Node.js | 20.x LTS | JavaScript runtime |
| Framework | Express.js | 4.x | Web framework |
| Language | TypeScript | 5.x | Type safety |
| Database | MongoDB | 7.x | Primary database |
| Cache | Redis | 7.x | Caching layer |
| ORM | Mongoose | 8.x | MongoDB object modeling |
| Authentication | JWT | 9.x | Token-based auth |
| Real-time | Socket.io | 4.x | WebSocket server |
| File Upload | Multer | 1.x | File handling |
| Image Processing | Sharp | 0.x | Image optimization |

### 3.3 AI & ML Technologies

| Component | Technology | Purpose |
|-----------|------------|---------|
| Language Model | OpenAI GPT-4 | Profile generation |
| Translation | Google Translate API | Multilingual support |
| Text Processing | Natural | NLP utilities |
| Vector Search | MongoDB Atlas Search | Semantic search |
| Recommendation | Custom Algorithm | Smart matching |

### 3.4 Infrastructure & DevOps

| Component | Technology | Purpose |
|-----------|------------|---------|
| Cloud Provider | AWS | Cloud infrastructure |
| Containerization | Docker | Application containers |
| Orchestration | Kubernetes | Container orchestration |
| CI/CD | GitHub Actions | Automated deployment |
| Monitoring | DataDog | Application monitoring |
| Logging | Winston | Application logging |
| CDN | CloudFront | Content delivery |

## 4. Database Design

### 4.1 MongoDB Collections

#### Users Collection
```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string; // hashed
  role: 'customer' | 'provider' | 'admin';
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    avatar?: string;
    language: string;
    location: {
      address: string;
      coordinates: [number, number]; // [lng, lat]
      city: string;
      state: string;
      pincode: string;
    };
  };
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Providers Collection
```typescript
interface Provider {
  _id: ObjectId;
  userId: ObjectId;
  businessName: string;
  description: string;
  aiGeneratedProfile: {
    summary: string;
    skills: string[];
    experience: string;
    specialties: string[];
  };
  services: {
    category: string;
    subcategory: string;
    basePrice: number;
    unit: 'hour' | 'service' | 'square_feet';
  }[];
  serviceAreas: {
    city: string;
    pincodes: string[];
    radius: number; // in km
  }[];
  availability: {
    days: string[]; // ['monday', 'tuesday', ...]
    timeSlots: {
      start: string; // '09:00'
      end: string;   // '18:00'
    }[];
  };
  rating: {
    average: number;
    count: number;
  };
  portfolio: {
    images: string[];
    descriptions: string[];
  }[];
  documents: {
    type: 'license' | 'certificate' | 'insurance';
    url: string;
    verified: boolean;
  }[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Bookings Collection
```typescript
interface Booking {
  _id: ObjectId;
  customerId: ObjectId;
  providerId: ObjectId;
  service: {
    category: string;
    subcategory: string;
    description: string;
    estimatedDuration: number; // in hours
  };
  location: {
    address: string;
    coordinates: [number, number];
    instructions?: string;
  };
  schedule: {
    preferredDate: Date;
    preferredTime: string;
    confirmedDate?: Date;
    confirmedTime?: string;
  };
  pricing: {
    basePrice: number;
    additionalCharges: number;
    totalAmount: number;
    currency: string;
  };
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment: {
    method: 'online' | 'cash' | 'wallet';
    status: 'pending' | 'paid' | 'refunded';
    transactionId?: string;
  };
  review?: {
    rating: number;
    comment: string;
    images?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Messages Collection
```typescript
interface Message {
  _id: ObjectId;
  bookingId: ObjectId;
  senderId: ObjectId;
  receiverId: ObjectId;
  content: string;
  type: 'text' | 'image' | 'file' | 'location';
  attachments?: {
    url: string;
    filename: string;
    size: number;
  }[];
  isRead: boolean;
  createdAt: Date;
}
```

### 4.2 Database Indexes

```javascript
// Users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ "profile.location.coordinates": "2dsphere" });
db.users.createIndex({ role: 1, isActive: 1 });

// Providers collection indexes
db.providers.createIndex({ userId: 1 }, { unique: true });
db.providers.createIndex({ "serviceAreas.city": 1 });
db.providers.createIndex({ "services.category": 1 });
db.providers.createIndex({ "profile.location.coordinates": "2dsphere" });
db.providers.createIndex({ rating: -1, isActive: 1 });

// Bookings collection indexes
db.bookings.createIndex({ customerId: 1, createdAt: -1 });
db.bookings.createIndex({ providerId: 1, createdAt: -1 });
db.bookings.createIndex({ status: 1, "schedule.confirmedDate": 1 });
db.bookings.createIndex({ "location.coordinates": "2dsphere" });

// Messages collection indexes
db.messages.createIndex({ bookingId: 1, createdAt: -1 });
db.messages.createIndex({ senderId: 1, receiverId: 1 });
```

## 5. API Design

### 5.1 RESTful API Endpoints

#### Authentication Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-email/:token
```

#### User Management Endpoints
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/upload-avatar
GET    /api/users/bookings
GET    /api/users/messages
```

#### Provider Endpoints
```
POST   /api/providers/register
GET    /api/providers/profile
PUT    /api/providers/profile
POST   /api/providers/generate-profile
GET    /api/providers/services
POST   /api/providers/services
PUT    /api/providers/services/:id
DELETE /api/providers/services/:id
GET    /api/providers/bookings
PUT    /api/providers/bookings/:id/status
GET    /api/providers/analytics
```

#### Search Endpoints
```
GET    /api/search/providers
GET    /api/search/services
POST   /api/search/ai-recommendations
GET    /api/search/suggestions
```

#### Booking Endpoints
```
POST   /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id
POST   /api/bookings/:id/confirm
POST   /api/bookings/:id/cancel
POST   /api/bookings/:id/complete
```

#### Messaging Endpoints
```
GET    /api/messages/:bookingId
POST   /api/messages
PUT    /api/messages/:id/read
GET    /api/messages/conversations
```

### 5.2 API Response Format

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNext?: boolean;
  };
}
```

### 5.3 Error Handling

```typescript
enum ErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

class APIError extends Error {
  constructor(
    public code: ErrorCodes,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
  }
}
```

## 6. Security Implementation

### 6.1 Authentication & Authorization

```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
  iat: number;
  exp: number;
}

// Password Hashing
import bcrypt from 'bcryptjs';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// JWT Middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user as JWTPayload;
    next();
  });
};
```

### 6.2 Input Validation

```typescript
import { body, validationResult } from 'express-validator';

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('firstName').trim().isLength({ min: 2, max: 50 }),
  body('lastName').trim().isLength({ min: 2, max: 50 }),
  body('phone').isMobilePhone('en-IN'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

### 6.3 Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
```

## 7. AI Integration Architecture

### 7.1 Profile Generation Service

```typescript
class ProfileGenerationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateProfile(description: string, language: string = 'en'): Promise<AIProfile> {
    const prompt = `
    Generate a professional service provider profile from the following description:
    
    Description: ${description}
    Language: ${language}
    
    Return a JSON object with the following structure:
    {
      "summary": "Professional summary in ${language}",
      "skills": ["skill1", "skill2", "skill3"],
      "experience": "Experience level description",
      "specialties": ["specialty1", "specialty2"],
      "serviceAreas": ["area1", "area2"],
      "pricing": {
        "basePrice": 500,
        "currency": "INR",
        "unit": "hour"
      }
    }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return JSON.parse(response.choices[0].message.content!);
  }
}
```

### 7.2 Smart Matching Algorithm

```typescript
class SmartMatchingService {
  async findMatchingProviders(
    customerLocation: [number, number],
    serviceCategory: string,
    requirements: string,
    maxDistance: number = 10
  ): Promise<ProviderMatch[]> {
    // 1. Find providers within distance
    const nearbyProviders = await this.findNearbyProviders(
      customerLocation,
      maxDistance
    );

    // 2. Filter by service category
    const categoryMatches = nearbyProviders.filter(
      provider => provider.services.some(s => s.category === serviceCategory)
    );

    // 3. AI-powered requirement matching
    const aiMatches = await this.aiRequirementMatching(
      requirements,
      categoryMatches
    );

    // 4. Score and rank providers
    return this.scoreAndRankProviders(aiMatches, customerLocation);
  }

  private async aiRequirementMatching(
    requirements: string,
    providers: Provider[]
  ): Promise<ProviderMatch[]> {
    // Use OpenAI to match requirements with provider profiles
    const prompt = `
    Match the following customer requirements with provider profiles:
    
    Requirements: ${requirements}
    
    Providers: ${JSON.stringify(providers.map(p => ({
      id: p._id,
      description: p.description,
      skills: p.aiGeneratedProfile.skills,
      specialties: p.aiGeneratedProfile.specialties
    })))}
    
    Return a JSON array of matches with scores (0-100):
    [{"providerId": "id", "score": 85, "reason": "Matches plumbing expertise"}]
    `;

    // Implementation details...
  }
}
```

## 8. Real-time Communication

### 8.1 Socket.io Implementation

```typescript
// Server-side Socket.io setup
import { Server } from 'socket.io';

const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join booking room
    socket.on('join-booking', (bookingId: string) => {
      socket.join(`booking-${bookingId}`);
    });

    // Handle messages
    socket.on('send-message', async (data: MessageData) => {
      try {
        const message = await Message.create(data);
        
        // Emit to booking room
        io.to(`booking-${data.bookingId}`).emit('new-message', message);
        
        // Emit to specific user
        socket.to(data.receiverId).emit('message-notification', {
          bookingId: data.bookingId,
          senderId: data.senderId,
          preview: data.content.substring(0, 50)
        });
      } catch (error) {
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Handle booking updates
    socket.on('booking-update', (bookingId: string, status: string) => {
      io.to(`booking-${bookingId}`).emit('booking-status-changed', {
        bookingId,
        status,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
```

### 8.2 Client-side Socket Integration

```typescript
// React hook for Socket.io
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (bookingId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL!);
    setSocket(newSocket);

    if (bookingId) {
      newSocket.emit('join-booking', bookingId);
    }

    newSocket.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('booking-status-changed', (data) => {
      // Handle booking status updates
      console.log('Booking status changed:', data);
    });

    return () => {
      newSocket.close();
    };
  }, [bookingId]);

  const sendMessage = (content: string, receiverId: string) => {
    if (socket && bookingId) {
      socket.emit('send-message', {
        bookingId,
        content,
        receiverId,
        senderId: getCurrentUserId()
      });
    }
  };

  return { socket, messages, sendMessage };
};
```

## 9. Performance Optimization

### 9.1 Caching Strategy

```typescript
import Redis from 'ioredis';

class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!);
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage in API endpoints
const getProviders = async (req: Request, res: Response) => {
  const cacheKey = `providers:${req.query.city}:${req.query.category}`;
  
  let providers = await cacheService.get<Provider[]>(cacheKey);
  
  if (!providers) {
    providers = await Provider.find(query).lean();
    await cacheService.set(cacheKey, providers, 1800); // 30 minutes
  }
  
  res.json(providers);
};
```

### 9.2 Database Query Optimization

```typescript
// Optimized provider search with aggregation
const searchProviders = async (filters: SearchFilters) => {
  const pipeline = [
    // Match stage
    {
      $match: {
        isActive: true,
        isVerified: true,
        'serviceAreas.city': filters.city,
        'services.category': filters.category
      }
    },
    // GeoNear stage for location-based search
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: filters.coordinates
        },
        distanceField: 'distance',
        maxDistance: filters.maxDistance * 1000, // Convert km to meters
        spherical: true
      }
    },
    // Lookup for recent reviews
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'providerId',
        as: 'recentReviews',
        pipeline: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 }
        ]
      }
    },
    // Add computed fields
    {
      $addFields: {
        averageRating: { $avg: '$recentReviews.rating' },
        reviewCount: { $size: '$recentReviews' }
      }
    },
    // Sort by distance and rating
    {
      $sort: {
        distance: 1,
        averageRating: -1
      }
    },
    // Limit results
    { $limit: filters.limit || 20 }
  ];

  return await Provider.aggregate(pipeline);
};
```

## 10. Monitoring & Logging

### 10.1 Application Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Usage in controllers
const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.create(req.body);
    logger.info('Booking created', { bookingId: booking._id, customerId: req.user.userId });
    res.json(booking);
  } catch (error) {
    logger.error('Failed to create booking', { error: error.message, customerId: req.user.userId });
    res.status(500).json({ error: 'Failed to create booking' });
  }
};
```

### 10.2 Health Checks

```typescript
const healthCheck = async (req: Request, res: Response) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    openai: await checkOpenAI(),
    timestamp: new Date().toISOString()
  };

  const isHealthy = Object.values(checks).every(check => check.status === 'healthy');
  
  res.status(isHealthy ? 200 : 503).json(checks);
};

const checkDatabase = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy', responseTime: Date.now() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};
```

## 11. Deployment Strategy

### 11.1 Docker Configuration

```dockerfile
# Dockerfile for API service
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/localkart
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis

  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - api

  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

### 11.2 Kubernetes Deployment

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: localkart-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: localkart-api
  template:
    metadata:
      labels:
        app: localkart-api
    spec:
      containers:
      - name: api
        image: localkart/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: localkart-secrets
              key: mongodb-uri
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## 12. Testing Strategy

### 12.1 Unit Testing

```typescript
// Example unit test for ProfileGenerationService
import { ProfileGenerationService } from '../services/ProfileGenerationService';

describe('ProfileGenerationService', () => {
  let service: ProfileGenerationService;

  beforeEach(() => {
    service = new ProfileGenerationService();
  });

  it('should generate profile from description', async () => {
    const description = 'I am a plumber with 10 years experience';
    const profile = await service.generateProfile(description);
    
    expect(profile).toHaveProperty('summary');
    expect(profile).toHaveProperty('skills');
    expect(profile.skills).toContain('plumbing');
    expect(profile.experience).toContain('10 years');
  });
});
```

### 12.2 Integration Testing

```typescript
// Example integration test for booking API
import request from 'supertest';
import app from '../app';

describe('Booking API', () => {
  let authToken: string;
  let customerId: string;
  let providerId: string;

  beforeAll(async () => {
    // Setup test data
    const customer = await createTestCustomer();
    const provider = await createTestProvider();
    authToken = await getAuthToken(customer);
    customerId = customer._id;
    providerId = provider._id;
  });

  it('should create a booking', async () => {
    const bookingData = {
      providerId,
      service: {
        category: 'plumbing',
        description: 'Fix leaky faucet'
      },
      location: {
        address: '123 Test St',
        coordinates: [77.2090, 28.6139]
      },
      schedule: {
        preferredDate: new Date(),
        preferredTime: '10:00'
      }
    };

    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(bookingData)
      .expect(201);

    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.status).toBe('pending');
  });
});
```

## 13. Security Considerations

### 13.1 Data Protection

```typescript
// Data encryption for sensitive fields
import crypto from 'crypto';

class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('localkart'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAAD(Buffer.from('localkart'));
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### 13.2 API Security

```typescript
// Security headers middleware
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 14. Conclusion

This Engineering Review Document provides a comprehensive technical blueprint for building the LocalKart platform. The architecture is designed to be scalable, maintainable, and secure, with proper separation of concerns and modern development practices.

Key technical highlights:
- **Microservices architecture** for scalability
- **TypeScript** throughout for type safety
- **MongoDB** with proper indexing for performance
- **AI integration** with OpenAI for profile generation
- **Real-time communication** with Socket.io
- **Comprehensive security** measures
- **Docker containerization** for deployment
- **Kubernetes orchestration** for scaling
- **Comprehensive testing** strategy

The implementation should follow this document closely while adapting to specific requirements and constraints as they arise during development.

---

**Document Status**: Draft  
**Next Review**: [Date]  
**Technical Lead**: [Name]  
**Version Control**: 1.0
