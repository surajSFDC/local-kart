#!/bin/bash

# LocalKart MVP Startup Script
echo "🚀 Starting LocalKart MVP..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Navigate to infrastructure directory
cd infrastructure

echo "📦 Building and starting services..."

# Start services with Docker Compose
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."

# Check API health
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ API service is running at http://localhost:3000"
else
    echo "⚠️  API service may still be starting up..."
fi

# Check Web App
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Web application is running at http://localhost:3001"
else
    echo "⚠️  Web application may still be starting up..."
fi

echo ""
echo "🎉 LocalKart MVP is starting up!"
echo ""
echo "📱 Web Application: http://localhost:3001"
echo "🔌 API Endpoint: http://localhost:3000"
echo "🗄️  MongoDB: localhost:27017"
echo "⚡ Redis: localhost:6379"
echo ""
echo "📚 Check the README.md for detailed documentation"
echo "🛠️  To stop services: docker-compose down"
echo "📊 To view logs: docker-compose logs -f"
echo ""
echo "Happy coding! 🚀"