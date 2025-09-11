#!/bin/bash

# Test Setup Script for Garissa E-commerce
# This script tests if the setup was successful

echo "🧪 Testing Garissa E-commerce Setup"
echo "==================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test counters
TESTS=0
PASSED=0
FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS=$((TESTS + 1))
    print_test "$test_name"
    
    if eval "$test_command" >/dev/null 2>&1; then
        print_pass "$test_name"
        PASSED=$((PASSED + 1))
    else
        print_fail "$test_name"
        FAILED=$((FAILED + 1))
    fi
}

# Test system requirements
echo "🔍 Testing System Requirements..."
echo "================================"

run_test "Python 3.11 installed" "python3 --version | grep -q 'Python 3.11'"
run_test "Node.js installed" "node --version"
run_test "npm installed" "npm --version"
run_test "Git installed" "git --version"
run_test "PostgreSQL running" "systemctl is-active --quiet postgresql"
run_test "Redis running" "systemctl is-active --quiet redis-server"

# Test project structure
echo ""
echo "📁 Testing Project Structure..."
echo "=============================="

run_test "Backend directory exists" "[ -d 'Backend' ]"
run_test "Frontend directory exists" "[ -d 'Frontend' ]"
run_test "Backend virtual environment exists" "[ -d 'Backend/venv' ]"
run_test "Backend requirements.txt exists" "[ -f 'Backend/requirements.txt' ]"
run_test "Frontend package.json exists" "[ -f 'Frontend/package.json' ]"
run_test "Backend .env file exists" "[ -f 'Backend/.env' ]"
run_test "Frontend .env file exists" "[ -f 'Frontend/.env' ]"

# Test startup scripts
echo ""
echo "🚀 Testing Startup Scripts..."
echo "============================="

run_test "start-project.sh exists and executable" "[ -x 'start-project.sh' ]"
run_test "start-backend.sh exists and executable" "[ -x 'start-backend.sh' ]"
run_test "start-frontend.sh exists and executable" "[ -x 'start-frontend.sh' ]"

# Test Python environment
echo ""
echo "🐍 Testing Python Environment..."
echo "==============================="

if [ -d "Backend/venv" ]; then
    cd Backend
    source venv/bin/activate
    
    run_test "Flask installed" "python -c 'import flask'"
    run_test "SQLAlchemy installed" "python -c 'import flask_sqlalchemy'"
    run_test "Flask-CORS installed" "python -c 'import flask_cors'"
    run_test "bcrypt installed" "python -c 'import bcrypt'"
    
    cd ..
else
    print_fail "Backend virtual environment not found"
    FAILED=$((FAILED + 1))
fi

# Test Node.js environment
echo ""
echo "📦 Testing Node.js Environment..."
echo "================================"

if [ -d "Frontend" ]; then
    cd Frontend
    
    run_test "React installed" "npm list react >/dev/null 2>&1"
    run_test "Vite installed" "npm list vite >/dev/null 2>&1"
    run_test "Node modules exist" "[ -d 'node_modules' ]"
    
    cd ..
else
    print_fail "Frontend directory not found"
    FAILED=$((FAILED + 1))
fi

# Test database connection
echo ""
echo "🗄️ Testing Database Connection..."
echo "================================"

if command -v psql >/dev/null 2>&1; then
    run_test "PostgreSQL accessible" "sudo -u postgres psql -c 'SELECT 1;' >/dev/null 2>&1"
    
    # Test if database exists
    if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw garissa_ecommerce; then
        print_pass "Database 'garissa_ecommerce' exists"
        PASSED=$((PASSED + 1))
    else
        print_fail "Database 'garissa_ecommerce' not found"
        FAILED=$((FAILED + 1))
    fi
    TESTS=$((TESTS + 1))
else
    print_fail "PostgreSQL client not found"
    FAILED=$((FAILED + 1))
    TESTS=$((TESTS + 1))
fi

# Test Redis connection
echo ""
echo "🔴 Testing Redis Connection..."
echo "============================="

if command -v redis-cli >/dev/null 2>&1; then
    run_test "Redis accessible" "redis-cli ping | grep -q PONG"
else
    print_fail "Redis client not found"
    FAILED=$((FAILED + 1))
    TESTS=$((TESTS + 1))
fi

# Test ports availability
echo ""
echo "🌐 Testing Port Availability..."
echo "=============================="

run_test "Port 5000 available" "! netstat -tuln | grep -q ':5000 '"
run_test "Port 5173 available" "! netstat -tuln | grep -q ':5173 '"

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo "Total Tests: $TESTS"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    print_pass "🎉 All tests passed! Setup is complete and ready to use."
    echo ""
    echo "🚀 Next steps:"
    echo "1. Run: ./start-project.sh"
    echo "2. Open: http://localhost:5173"
    echo "3. Login: admin@garissa.com / Admin123"
else
    echo ""
    print_fail "❌ Some tests failed. Please check the setup."
    echo ""
    echo "🔧 Common fixes:"
    echo "- Run the full setup script: ./setup.sh"
    echo "- Check if all services are running"
    echo "- Verify file permissions"
    echo "- Check network connectivity"
fi

echo ""
echo "📝 For detailed setup instructions, see SETUP_README.md"
