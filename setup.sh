#!/bin/bash

# Garissa E-commerce Project Setup Script
# This script sets up the development environment for the Garissa e-commerce project
# Run this script on a fresh Ubuntu/WSL installation

set -e  # Exit on any error

echo "🚀 Starting Garissa E-commerce Project Setup..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on Ubuntu/WSL
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    print_error "This script is designed for Ubuntu/WSL. Please run on a Linux environment."
    exit 1
fi

print_status "Detected Linux environment. Proceeding with setup..."

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System packages updated"

# Install essential development tools
print_status "Installing essential development tools..."
sudo apt install -y \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    unzip \
    vim \
    nano \
    htop \
    tree \
    jq
print_success "Essential development tools installed"

# Install Python 3.11 and pip
print_status "Installing Python 3.11 and pip..."
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.11 1
print_success "Python 3.11 and pip installed"

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
print_success "Node.js $(node --version) installed"

# Install npm packages globally
print_status "Installing global npm packages..."
sudo npm install -g npm@latest
sudo npm install -g yarn
sudo npm install -g pm2
print_success "Global npm packages installed"

# Install PostgreSQL
print_status "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
print_success "PostgreSQL installed and started"

# Install Redis (for session storage)
print_status "Installing Redis..."
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
print_success "Redis installed and started"

# Install Docker (optional but recommended)
print_status "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo systemctl start docker
sudo systemctl enable docker
print_success "Docker installed and started"

# Install Docker Compose
print_status "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
print_success "Docker Compose installed"

# Install VS Code (if not already installed)
if ! command -v code &> /dev/null; then
    print_status "Installing VS Code..."
    wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
    sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
    sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
    sudo apt update
    sudo apt install -y code
    print_success "VS Code installed"
else
    print_success "VS Code already installed"
fi

# Install Git configuration helper
print_status "Setting up Git configuration..."
if ! git config --global user.name &> /dev/null; then
    echo "Please configure Git with your details:"
    read -p "Enter your Git username: " git_username
    read -p "Enter your Git email: " git_email
    git config --global user.name "$git_username"
    git config --global user.email "$git_email"
    print_success "Git configured"
else
    print_success "Git already configured"
fi

# Create project directory structure
print_status "Setting up project directory structure..."
PROJECT_DIR="$HOME/development/code/project"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Clone the project if it doesn't exist
if [ ! -d "Garissa-e-commerce" ]; then
    print_status "Cloning Garissa e-commerce project..."
    git clone https://github.com/your-username/Garissa-e-commerce.git
    print_success "Project cloned"
else
    print_success "Project directory already exists"
fi

cd Garissa-e-commerce

# Setup Backend Environment
print_status "Setting up Backend environment..."
cd Backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install Python dependencies
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    print_success "Python dependencies installed"
else
    print_warning "requirements.txt not found. Installing basic Flask dependencies..."
    pip install flask flask-sqlalchemy flask-migrate flask-cors flask-mail flask-session bcrypt python-dotenv
fi

# Setup database
print_status "Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE garissa_ecommerce;"
sudo -u postgres psql -c "CREATE USER garissa_user WITH PASSWORD 'garissa_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE garissa_ecommerce TO garissa_user;"
print_success "Database setup completed"

# Create .env file for backend
print_status "Creating backend .env file..."
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://garissa_user:garissa_password@localhost:5432/garissa_ecommerce

# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-this-in-production

# Email Configuration (Optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# File Upload Configuration
MAX_CONTENT_LENGTH=16777216  # 16MB
UPLOAD_FOLDER=uploads

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174
EOF
print_success "Backend .env file created"

# Initialize database
print_status "Initializing database..."
python -c "
from app import create_app, db
app = create_app()
with app.app_context():
    db.create_all()
    print('Database tables created successfully')
"
print_success "Database initialized"

# Create admin user
print_status "Creating admin user..."
python create_admin.py
print_success "Admin user created"

cd ..

# Setup Frontend Environment
print_status "Setting up Frontend environment..."
cd Frontend

# Install Node.js dependencies
npm install
print_success "Frontend dependencies installed"

# Create .env file for frontend
print_status "Creating frontend .env file..."
cat > .env << EOF
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Garissa E-commerce

# Development Configuration
VITE_DEV_MODE=true
EOF
print_success "Frontend .env file created"

cd ..

# Create startup scripts
print_status "Creating startup scripts..."

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd Backend
source venv/bin/activate
python run.py
EOF
chmod +x start-backend.sh

# Frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd Frontend
npm run dev
EOF
chmod +x start-frontend.sh

# Full project startup script
cat > start-project.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Garissa E-commerce Project..."

# Start backend in background
echo "Starting backend server..."
cd Backend
source venv/bin/activate
python run.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../Frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Project started successfully!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
EOF
chmod +x start-project.sh

print_success "Startup scripts created"

# Create development helper scripts
print_status "Creating development helper scripts..."

# Database reset script
cat > reset-database.sh << 'EOF'
#!/bin/bash
cd Backend
source venv/bin/activate
python -c "
from app import create_app, db
app = create_app()
with app.app_context():
    db.drop_all()
    db.create_all()
    print('Database reset successfully')
"
python create_admin.py
echo "Database reset and admin user recreated"
EOF
chmod +x reset-database.sh

# Install VS Code extensions
print_status "Installing recommended VS Code extensions..."
code --install-extension ms-python.python
code --install-extension ms-python.flake8
code --install-extension ms-python.black-formatter
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-json
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
print_success "VS Code extensions installed"

# Create project documentation
print_status "Creating project documentation..."
cat > SETUP_COMPLETE.md << 'EOF'
# Garissa E-commerce Setup Complete! 🎉

## What was installed:
- ✅ Python 3.11 with pip
- ✅ Node.js 18.x with npm and yarn
- ✅ PostgreSQL database
- ✅ Redis server
- ✅ Docker and Docker Compose
- ✅ VS Code with extensions
- ✅ Git configuration

## Project Structure:
```
Garissa-e-commerce/
├── Backend/                 # Flask API server
│   ├── venv/               # Python virtual environment
│   ├── .env                # Backend environment variables
│   └── requirements.txt    # Python dependencies
├── Frontend/               # React frontend
│   ├── node_modules/       # Node.js dependencies
│   └── .env                # Frontend environment variables
├── start-project.sh        # Start both servers
├── start-backend.sh        # Start backend only
├── start-frontend.sh       # Start frontend only
└── reset-database.sh       # Reset database
```

## Quick Start:
1. **Start the entire project:**
   ```bash
   ./start-project.sh
   ```

2. **Or start servers individually:**
   ```bash
   # Terminal 1 - Backend
   ./start-backend.sh
   
   # Terminal 2 - Frontend
   ./start-frontend.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Login: http://localhost:5173/admin
     - Email: admin@garissa.com
     - Password: Admin123

## Database:
- **Database:** garissa_ecommerce
- **User:** garissa_user
- **Password:** garissa_password
- **Host:** localhost:5432

## Development Commands:
```bash
# Reset database
./reset-database.sh

# Install new Python packages
cd Backend
source venv/bin/activate
pip install package-name
pip freeze > requirements.txt

# Install new Node.js packages
cd Frontend
npm install package-name
```

## VS Code Extensions Installed:
- Python
- Python Flake8
- Python Black Formatter
- Tailwind CSS IntelliSense
- Prettier
- JSON
- Auto Rename Tag
- Path IntelliSense

## Next Steps:
1. Open the project in VS Code: `code .`
2. Start developing! 🚀
3. Check the README.md for more detailed documentation

Happy coding! 🎉
EOF

print_success "Project documentation created"

# Final setup verification
print_status "Verifying installation..."
echo ""
echo "🔍 Installation Verification:"
echo "=============================="

# Check Python
if command -v python3 &> /dev/null; then
    print_success "Python $(python3 --version) ✓"
else
    print_error "Python not found ✗"
fi

# Check Node.js
if command -v node &> /dev/null; then
    print_success "Node.js $(node --version) ✓"
else
    print_error "Node.js not found ✗"
fi

# Check npm
if command -v npm &> /dev/null; then
    print_success "npm $(npm --version) ✓"
else
    print_error "npm not found ✗"
fi

# Check PostgreSQL
if systemctl is-active --quiet postgresql; then
    print_success "PostgreSQL is running ✓"
else
    print_error "PostgreSQL is not running ✗"
fi

# Check Redis
if systemctl is-active --quiet redis-server; then
    print_success "Redis is running ✓"
else
    print_error "Redis is not running ✗"
fi

# Check Docker
if command -v docker &> /dev/null; then
    print_success "Docker $(docker --version) ✓"
else
    print_error "Docker not found ✗"
fi

echo ""
print_success "🎉 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Read SETUP_COMPLETE.md for detailed information"
echo "2. Run './start-project.sh' to start the application"
echo "3. Open http://localhost:5173 in your browser"
echo "4. Login as admin with: admin@garissa.com / Admin123"
echo ""
echo "📁 Project location: $(pwd)"
echo "🔧 Start development: code ."
echo ""
print_warning "Note: You may need to restart your terminal or run 'source ~/.bashrc' to use new commands"
echo ""
print_success "Happy coding! 🚀"
