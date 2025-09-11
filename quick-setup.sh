#!/bin/bash

# Quick Setup Script for Garissa E-commerce
# Use this if you already have Python, Node.js, and PostgreSQL installed

set -e

echo "🚀 Quick Setup for Garissa E-commerce Project"
echo "============================================="

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

# Check if we're in the right directory
if [ ! -d "Backend" ] || [ ! -d "Frontend" ]; then
    echo "❌ Please run this script from the Garissa-e-commerce project root directory"
    exit 1
fi

# Setup Backend
print_status "Setting up Backend..."
cd Backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_success "Virtual environment created"
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    print_success "Python dependencies installed"
else
    print_warning "requirements.txt not found, installing basic dependencies..."
    pip install flask flask-sqlalchemy flask-migrate flask-cors flask-mail flask-session bcrypt python-dotenv
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
DATABASE_URL=postgresql://garissa_user:garissa_password@localhost:5432/garissa_ecommerce
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-this-in-production
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAX_CONTENT_LENGTH=16777216
UPLOAD_FOLDER=uploads
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174
EOF
    print_success ".env file created"
fi

# Initialize database
print_status "Initializing database..."
python -c "
from app import create_app, db
app = create_app()
with app.app_context():
    db.create_all()
    print('Database tables created')
" 2>/dev/null || print_warning "Database initialization skipped (app may not be ready)"

# Create admin user if script exists
if [ -f "create_admin.py" ]; then
    python create_admin.py 2>/dev/null || print_warning "Admin user creation skipped"
fi

cd ..

# Setup Frontend
print_status "Setting up Frontend..."
cd Frontend

# Install Node.js dependencies
npm install
print_success "Frontend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating frontend .env file..."
    cat > .env << EOF
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Garissa E-commerce
VITE_DEV_MODE=true
EOF
    print_success "Frontend .env file created"
fi

cd ..

# Create startup scripts
print_status "Creating startup scripts..."

cat > start-backend.sh << 'EOF'
#!/bin/bash
cd Backend
source venv/bin/activate
python run.py
EOF
chmod +x start-backend.sh

cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd Frontend
npm run dev
EOF
chmod +x start-frontend.sh

cat > start-project.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Garissa E-commerce Project..."

cd Backend
source venv/bin/activate
python run.py &
BACKEND_PID=$!

sleep 3

cd ../Frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Project started!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop"

wait $BACKEND_PID $FRONTEND_PID
EOF
chmod +x start-project.sh

print_success "Startup scripts created"

echo ""
print_success "🎉 Quick setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure PostgreSQL is running"
echo "2. Create database: sudo -u postgres createdb garissa_ecommerce"
echo "3. Start the project: ./start-project.sh"
echo "4. Open http://localhost:5173"
echo ""
echo "🔑 Admin login: admin@garissa.com / Admin123"
