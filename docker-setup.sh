#!/bin/bash

# Docker Setup Script for Garissa E-commerce
# This script sets up the project using Docker containers

set -e

echo "🐳 Docker Setup for Garissa E-commerce Project"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_warning "Docker is not installed. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    print_success "Docker installed. Please log out and back in to use Docker without sudo."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose is not installed. Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed"
fi

# Create Docker Compose file
print_status "Creating Docker Compose configuration..."

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: garissa_ecommerce
      POSTGRES_USER: garissa_user
      POSTGRES_PASSWORD: garissa_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U garissa_user -d garissa_ecommerce"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis for session storage
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Flask API
  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://garissa_user:garissa_password@db:5432/garissa_ecommerce
      - REDIS_URL=redis://redis:6379
      - FLASK_APP=run.py
      - FLASK_ENV=development
      - SECRET_KEY=your-secret-key-change-this-in-production
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./Backend:/app
      - backend_uploads:/app/uploads
    command: >
      sh -c "python -c 'from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()' &&
             python create_admin.py &&
             python run.py"

  # Frontend React App
  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:5000
    depends_on:
      - backend
    volumes:
      - ./Frontend:/app
      - /app/node_modules
    command: npm run dev -- --host 0.0.0.0

volumes:
  postgres_data:
  redis_data:
  backend_uploads:
EOF

# Create Backend Dockerfile
print_status "Creating Backend Dockerfile..."

cat > Backend/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Default command
CMD ["python", "run.py"]
EOF

# Create Frontend Dockerfile
print_status "Creating Frontend Dockerfile..."

cat > Frontend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 5173

# Default command
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
EOF

# Create .dockerignore files
print_status "Creating .dockerignore files..."

cat > Backend/.dockerignore << 'EOF'
venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
.env
.venv
*.sqlite
*.db
uploads/
.DS_Store
.git/
.gitignore
README.md
EOF

cat > Frontend/.dockerignore << 'EOF'
node_modules/
dist/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
.git/
.gitignore
README.md
EOF

# Create Docker startup script
print_status "Creating Docker startup script..."

cat > start-docker.sh << 'EOF'
#!/bin/bash

echo "🐳 Starting Garissa E-commerce with Docker..."
echo "============================================="

# Build and start all services
docker-compose up --build

echo ""
echo "✅ Services started!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"
echo "Database: localhost:5432"
echo "Redis: localhost:6379"
echo ""
echo "Press Ctrl+C to stop all services"
EOF

chmod +x start-docker.sh

# Create Docker stop script
cat > stop-docker.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping Garissa E-commerce Docker services..."
docker-compose down
echo "✅ All services stopped"
EOF

chmod +x stop-docker.sh

# Create Docker reset script
cat > reset-docker.sh << 'EOF'
#!/bin/bash

echo "🔄 Resetting Garissa E-commerce Docker setup..."
echo "This will remove all containers, volumes, and data!"

read -p "Are you sure? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down -v
    docker system prune -f
    echo "✅ Docker setup reset complete"
else
    echo "❌ Reset cancelled"
fi
EOF

chmod +x reset-docker.sh

print_success "Docker setup files created"

echo ""
print_success "🎉 Docker setup completed!"
echo ""
echo "📋 Available Docker commands:"
echo "  ./start-docker.sh    - Start all services"
echo "  ./stop-docker.sh     - Stop all services"
echo "  ./reset-docker.sh    - Reset everything (removes data)"
echo ""
echo "🔧 Manual Docker commands:"
echo "  docker-compose up --build    - Build and start"
echo "  docker-compose down          - Stop services"
echo "  docker-compose logs          - View logs"
echo "  docker-compose ps            - Check status"
echo ""
echo "🌐 Access URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend: http://localhost:5000"
echo "  Admin: http://localhost:5173/admin (admin@garissa.com / Admin123)"
echo ""
print_warning "Note: First startup may take a few minutes to build images"
