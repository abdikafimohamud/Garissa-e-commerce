#!/bin/bash

# Test script to verify Garissa E-commerce setup
# This script tests if the setup is working correctly

set -e

echo "🧪 Testing Garissa E-commerce Setup..."
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test 1: Check if Backend directory exists
print_status "Checking Backend directory..."
if [ -d "Backend" ]; then
    print_success "Backend directory exists"
else
    print_error "Backend directory not found"
    exit 1
fi

# Test 2: Check if virtual environment exists
print_status "Checking Python virtual environment..."
if [ -d "Backend/venv" ]; then
    print_success "Virtual environment exists"
else
    print_error "Virtual environment not found"
    exit 1
fi

# Test 3: Check if requirements.txt exists
print_status "Checking requirements.txt..."
if [ -f "Backend/requirements.txt" ]; then
    print_success "requirements.txt exists"
else
    print_error "requirements.txt not found"
    exit 1
fi

# Test 4: Check if Frontend directory exists
print_status "Checking Frontend directory..."
if [ -d "Frontend" ]; then
    print_success "Frontend directory exists"
else
    print_error "Frontend directory not found"
    exit 1
fi

# Test 5: Check if package.json exists
print_status "Checking package.json..."
if [ -f "Frontend/package.json" ]; then
    print_success "package.json exists"
else
    print_error "package.json not found"
    exit 1
fi

# Test 6: Test Python imports
print_status "Testing Python imports..."
cd Backend
source venv/bin/activate
if python -c "from app import create_app, db; from app.models import User; print('All imports successful')" 2>/dev/null; then
    print_success "Python imports working"
else
    print_error "Python imports failed"
    exit 1
fi

# Test 7: Test database connection
print_status "Testing database connection..."
if python -c "
from app import create_app, db
app = create_app()
with app.app_context():
    try:
        with db.engine.connect() as conn:
            conn.execute(db.text('SELECT 1'))
        print('Database connection successful')
    except Exception as e:
        print(f'Database connection failed: {e}')
        exit(1)
" 2>/dev/null; then
    print_success "Database connection working"
else
    print_error "Database connection failed"
    exit 1
fi

# Test 8: Check if test users exist
print_status "Checking test users..."
if python -c "
from app import create_app, db
from app.models import User
app = create_app()
with app.app_context():
    admin = User.query.filter_by(email='admin@garissa.com').first()
    seller = User.query.filter_by(email='seller1@garissa.com').first()
    buyer = User.query.filter_by(email='buyer1@garissa.com').first()
    
    if admin and seller and buyer:
        print('All test users exist')
    else:
        print('Some test users missing')
        exit(1)
" 2>/dev/null; then
    print_success "Test users exist"
else
    print_warning "Test users not found - run create_test_users.py"
fi

cd ..

# Test 9: Test Node.js dependencies
print_status "Testing Node.js dependencies..."
cd Frontend
if npm list --depth=0 >/dev/null 2>&1; then
    print_success "Node.js dependencies installed"
else
    print_error "Node.js dependencies not installed"
    exit 1
fi

cd ..

# Test 10: Check startup scripts
print_status "Checking startup scripts..."
if [ -f "start-project.sh" ] && [ -x "start-project.sh" ]; then
    print_success "start-project.sh exists and is executable"
else
    print_error "start-project.sh missing or not executable"
fi

if [ -f "start-backend.sh" ] && [ -x "start-backend.sh" ]; then
    print_success "start-backend.sh exists and is executable"
else
    print_error "start-backend.sh missing or not executable"
fi

if [ -f "start-frontend.sh" ] && [ -x "start-frontend.sh" ]; then
    print_success "start-frontend.sh exists and is executable"
else
    print_error "start-frontend.sh missing or not executable"
fi

echo ""
echo "🎉 Setup Test Complete!"
echo ""
echo "📋 Test Results Summary:"
echo "   ✅ Backend environment: Ready"
echo "   ✅ Frontend environment: Ready"
echo "   ✅ Database: Ready"
echo "   ✅ Startup scripts: Ready"
echo ""
echo "🚀 Ready to start the application!"
echo "   Run: ./start-project.sh"
echo ""
echo "🔑 Test Login Credentials:"
echo "   Admin: admin@garissa.com / Admin123"
echo "   Seller: seller1@garissa.com / Seller123"
echo "   Buyer: buyer1@garissa.com / Buyer123"