# LocalKart - AI-Powered Local Services Platform

LocalKart is a comprehensive platform that connects local service providers (plumbers, electricians, cleaners, etc.) with customers across India. The platform leverages AI to generate professional profiles, provide multilingual support, enable smart matching, and facilitate seamless booking and communication.

## 🚀 Features

### Core Features
- **AI-Powered Profile Generation**: Convert natural language descriptions into structured service provider profiles
- **Multilingual Support**: Interface and search in multiple Indian languages
- **Smart Matching**: AI-powered matching of customers with suitable service providers
- **Real-time Booking System**: Handle service bookings with live updates
- **In-app Messaging**: Real-time communication between customers and providers
- **Location-based Search**: Find providers within specified radius
- **Rating & Review System**: Customer feedback and provider ratings

### User Roles
- **Customers**: Search, book, and communicate with service providers
- **Providers**: Manage profile, availability, bookings, and customer communication
- **Admin**: Platform management and oversight

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Real-time**: Socket.io
- **Authentication**: JWT
- **Containerization**: Docker + Docker Compose

### Project Structure
```
localkart/
├── apps/
│   └── web-app/                 # React frontend application
├── services/
│   ├── core-api/               # Express.js API server
│   └── auth-service/           # Authentication microservice
├── packages/
│   └── shared-types/           # Shared TypeScript types
├── infrastructure/
│   ├── docker-compose.yml      # Docker services configuration
│   └── k8s/                    # Kubernetes manifests
└── docs/                       # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Docker & Docker Compose
- MongoDB (if running locally)
- Redis (if running locally)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd localkart
   ```

2. **Start all services**
   ```bash
   cd infrastructure
   docker-compose up -d
   ```

3. **Access the application**
   - Web App: http://localhost:3001
   - API: http://localhost:3000
   - MongoDB: localhost:27017
   - Redis: localhost:6379

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install API dependencies
   cd services/core-api
   npm install
   
   # Install web app dependencies
   cd ../../apps/web-app
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment files
   cp services/core-api/.env.example services/core-api/.env
   cp apps/web-app/.env.example apps/web-app/.env
   ```

3. **Start MongoDB and Redis**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7
   docker run -d -p 6379:6379 --name redis redis:7-alpine
   ```

4. **Start the API server**
   ```bash
   cd services/core-api
   npm run dev
   ```

5. **Start the web application**
   ```bash
   cd apps/web-app
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Provider Endpoints
- `POST /api/providers/register` - Register as provider
- `GET /api/providers/profile` - Get provider profile
- `PUT /api/providers/profile` - Update provider profile
- `GET /api/providers/search` - Search providers
- `GET /api/providers/:id` - Get provider by ID

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/provider-bookings` - Get provider bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status

## 🗄️ Database Schema

### Collections
- **Users**: Customer and provider accounts
- **Providers**: Service provider profiles and business information
- **Bookings**: Service bookings and status tracking
- **Messages**: Real-time messaging between users

### Key Features
- Geospatial indexing for location-based queries
- Text search indexes for provider discovery
- Optimized queries with proper indexing strategy

## 🔧 Configuration

### Environment Variables

#### API Service
```env
MONGODB_URI=mongodb://localhost:27017/localkart
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3001
LOG_LEVEL=info
```

#### Web Application
```env
REACT_APP_API_URL=http://localhost:3000/api
```

## 🧪 Testing

### Run Tests
```bash
# API tests
cd services/core-api
npm test

# Web app tests
cd apps/web-app
npm test
```

### Test Coverage
- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for React components
- End-to-end tests for critical user flows

## 🚀 Deployment

### Production Deployment

1. **Build for production**
   ```bash
   # Build API
   cd services/core-api
   npm run build
   
   # Build web app
   cd apps/web-app
   npm run build
   ```

2. **Deploy with Docker**
   ```bash
   cd infrastructure
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Kubernetes Deployment
```bash
kubectl apply -f infrastructure/k8s/
```

## 📊 Monitoring & Logging

- **Application Logs**: Winston logger with structured logging
- **Health Checks**: Built-in health check endpoints
- **Error Tracking**: Comprehensive error handling and reporting
- **Performance Monitoring**: Request timing and database query optimization

## 🔒 Security

- **Authentication**: JWT-based authentication with secure token handling
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Comprehensive input sanitization and validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Properly configured Cross-Origin Resource Sharing
- **Security Headers**: Security headers for XSS and CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- ✅ Basic authentication and user management
- ✅ Provider registration and profile management
- ✅ Basic booking system
- ✅ Real-time messaging
- ✅ Search and discovery

### Phase 2: AI Integration
- 🔄 OpenAI profile generation
- 🔄 Smart matching algorithm
- 🔄 Multilingual support
- 🔄 Advanced search capabilities

### Phase 3: Enhanced Features
- 📋 Payment integration
- 📋 Advanced analytics
- 📋 Mobile app
- 📋 Push notifications

### Phase 4: Scale & Optimize
- 📋 Performance optimization
- 📋 Advanced monitoring
- 📋 Microservices architecture
- 📋 Global deployment

---

**Built with ❤️ for the Indian local services market**