import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.get('/', (_req, res) => {
  res.json({ 
    name: 'LocalKart Core API', 
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, password, profile } = req.body;
  
  if (!email || !password || !profile) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email, password, and profile are required'
      }
    });
  }

  // Mock user creation
  const user = {
    _id: 'mock-user-id',
    email,
    role: 'customer',
    profile,
    isVerified: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: {
      user,
      token: 'mock-jwt-token'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required'
      }
    });
  }

  // Mock user login
  const user = {
    _id: 'mock-user-id',
    email,
    role: 'customer',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '9876543210',
      language: 'en',
      location: {
        address: '123 Main St',
        coordinates: [77.2090, 28.6139],
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001'
      }
    },
    isVerified: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data: {
      user,
      token: 'mock-jwt-token'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  // Mock authenticated user
  const user = {
    _id: 'mock-user-id',
    email: 'user@example.com',
    role: 'customer',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '9876543210',
      language: 'en',
      location: {
        address: '123 Main St',
        coordinates: [77.2090, 28.6139],
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001'
      }
    },
    isVerified: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data: { user }
  });
});

// Provider routes
app.get('/api/providers/search', (req, res) => {
  const { city, category } = req.query;
  
  // Mock providers
  const providers = [
    {
      _id: 'provider-1',
      businessName: 'ABC Plumbing Services',
      description: 'Professional plumbing services for all your needs',
      rating: { average: 4.5, count: 25 },
      services: [
        { category: 'plumbing', subcategory: 'pipe repair', basePrice: 500, unit: 'service' }
      ],
      serviceAreas: [{ city: 'New Delhi', pincodes: ['110001'], radius: 10 }],
      isVerified: true,
      isActive: true
    },
    {
      _id: 'provider-2',
      businessName: 'XYZ Electrical Works',
      description: 'Expert electrical services and installations',
      rating: { average: 4.8, count: 18 },
      services: [
        { category: 'electrical', subcategory: 'wiring', basePrice: 800, unit: 'hour' }
      ],
      serviceAreas: [{ city: 'New Delhi', pincodes: ['110001'], radius: 15 }],
      isVerified: true,
      isActive: true
    }
  ];

  res.json({
    success: true,
    data: {
      providers,
      meta: {
        page: 1,
        limit: 20,
        total: providers.length,
        hasNext: false
      }
    }
  });
});

// Booking routes
app.post('/api/bookings', (req, res) => {
  const { providerId, service, location, schedule, pricing, payment } = req.body;
  
  if (!providerId || !service || !location || !schedule || !pricing || !payment) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'All booking fields are required'
      }
    });
  }

  // Mock booking creation
  const booking = {
    _id: 'booking-1',
    customerId: 'mock-user-id',
    providerId,
    service,
    location,
    schedule,
    pricing: {
      ...pricing,
      totalAmount: pricing.basePrice + (pricing.additionalCharges || 0)
    },
    payment: {
      ...payment,
      status: 'pending'
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: { booking }
  });
});

app.get('/api/bookings/my-bookings', (req, res) => {
  // Mock bookings
  const bookings = [
    {
      _id: 'booking-1',
      customerId: 'mock-user-id',
      providerId: 'provider-1',
      service: {
        category: 'plumbing',
        subcategory: 'pipe repair',
        description: 'Fix leaking pipe in kitchen',
        estimatedDuration: 2
      },
      location: {
        address: '123 Main St, New Delhi',
        coordinates: [77.2090, 28.6139],
        instructions: 'Ring the doorbell twice'
      },
      schedule: {
        preferredDate: new Date().toISOString(),
        preferredTime: '10:00'
      },
      pricing: {
        basePrice: 500,
        additionalCharges: 0,
        totalAmount: 500,
        currency: 'INR'
      },
      status: 'pending',
      payment: {
        method: 'online',
        status: 'pending'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: {
      bookings,
      meta: {
        page: 1,
        limit: 20,
        total: bookings.length,
        hasNext: false
      }
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
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

// Start server
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, () => {
  console.log(`🚀 LocalKart Core API listening on port ${port}`);
  console.log(`📱 Health check: http://localhost:${port}/api/health`);
});