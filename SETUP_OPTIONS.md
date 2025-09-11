# 🚀 Garissa E-commerce Setup Options

Choose the setup method that best fits your needs:

## 📋 Setup Options Overview

| Setup Method | Best For | Time Required | Prerequisites |
|--------------|----------|---------------|---------------|
| **Full Setup** | Fresh Ubuntu/WSL | 15-30 minutes | None |
| **Quick Setup** | Existing dev environment | 5-10 minutes | Python, Node.js, PostgreSQL |
| **Docker Setup** | Containerized development | 10-20 minutes | Docker |
| **Manual Setup** | Custom configuration | 30-60 minutes | Technical knowledge |

---

## 🆕 1. Full Setup (Recommended for New Laptops)

**Perfect for**: Fresh Ubuntu/WSL installations, new developers

```bash
./setup.sh
```

**What it does**:
- ✅ Installs all system dependencies (Python, Node.js, PostgreSQL, Redis, Docker)
- ✅ Sets up complete development environment
- ✅ Configures databases and creates admin user
- ✅ Installs VS Code with extensions
- ✅ Creates convenient startup scripts
- ✅ Generates comprehensive documentation

**Requirements**: Ubuntu/WSL with sudo access

---

## ⚡ 2. Quick Setup

**Perfect for**: Developers with existing Python, Node.js, and PostgreSQL

```bash
./quick-setup.sh
```

**What it does**:
- ✅ Sets up project dependencies
- ✅ Creates virtual environments
- ✅ Configures .env files
- ✅ Creates startup scripts
- ⚠️ Assumes you have Python, Node.js, and PostgreSQL already installed

**Requirements**: Python 3.11+, Node.js 18+, PostgreSQL

---

## 🐳 3. Docker Setup

**Perfect for**: Containerized development, team consistency

```bash
./docker-setup.sh
```

**What it does**:
- ✅ Creates Docker Compose configuration
- ✅ Sets up containerized PostgreSQL and Redis
- ✅ Builds Docker images for frontend and backend
- ✅ Creates Docker management scripts
- ✅ Isolated development environment

**Requirements**: Docker and Docker Compose

**Usage**:
```bash
./start-docker.sh    # Start all services
./stop-docker.sh     # Stop all services
./reset-docker.sh    # Reset everything
```

---

## 🧪 4. Test Your Setup

**Perfect for**: Verifying installation, troubleshooting

```bash
./test-setup.sh
```

**What it does**:
- ✅ Tests all system requirements
- ✅ Verifies project structure
- ✅ Checks database connections
- ✅ Validates Python and Node.js environments
- ✅ Provides detailed test results

---

## 📚 5. Manual Setup

**Perfect for**: Custom configurations, learning the process

Follow the detailed guide in `SETUP_README.md` for step-by-step manual installation.

---

## 🎯 Quick Start Guide

### For New Laptops (Ubuntu/WSL):
```bash
# 1. Clone the project
git clone <repository-url>
cd Garissa-e-commerce

# 2. Run full setup
./setup.sh

# 3. Start the project
./start-project.sh

# 4. Open browser
# Frontend: http://localhost:5173
# Admin: http://localhost:5173/admin (admin@garissa.com / Admin123)
```

### For Existing Development Environment:
```bash
# 1. Quick setup
./quick-setup.sh

# 2. Start the project
./start-project.sh
```

### For Docker Users:
```bash
# 1. Docker setup
./docker-setup.sh

# 2. Start with Docker
./start-docker.sh
```

---

## 🔧 Troubleshooting

### Common Issues:

1. **Permission Denied**:
   ```bash
   chmod +x *.sh
   ```

2. **Port Already in Use**:
   ```bash
   # Kill processes on ports 5000 and 5173
   sudo lsof -ti:5000 | xargs kill -9
   sudo lsof -ti:5173 | xargs kill -9
   ```

3. **Database Connection Failed**:
   ```bash
   # Start PostgreSQL
   sudo systemctl start postgresql
   
   # Create database manually
   sudo -u postgres createdb garissa_ecommerce
   ```

4. **Docker Issues**:
   ```bash
   # Reset Docker setup
   ./reset-docker.sh
   
   # Or manually
   docker-compose down -v
   docker system prune -f
   ```

### Test Your Setup:
```bash
./test-setup.sh
```

---

## 📞 Support

- **Documentation**: Check `SETUP_README.md` for detailed instructions
- **Test Script**: Run `./test-setup.sh` to diagnose issues
- **Logs**: Check terminal output for specific error messages
- **Docker Logs**: `docker-compose logs` for container issues

---

## 🎉 Success Indicators

After successful setup, you should see:
- ✅ All tests pass in `./test-setup.sh`
- ✅ Frontend loads at http://localhost:5173
- ✅ Backend API responds at http://localhost:5000
- ✅ Admin login works with admin@garissa.com / Admin123
- ✅ Database contains admin user and tables

Happy coding! 🚀
