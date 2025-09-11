# 🚀 Garissa E-commerce Setup Script

This script automates the complete setup of the Garissa e-commerce development environment on a fresh Ubuntu/WSL installation.

## 📋 What This Script Installs

### System Dependencies
- ✅ **Python 3.11** with pip and virtual environment support
- ✅ **Node.js 18.x** with npm and yarn
- ✅ **PostgreSQL** database server
- ✅ **Redis** for session storage
- ✅ **Docker & Docker Compose** for containerization
- ✅ **VS Code** with recommended extensions
- ✅ **Git** with configuration helper

### Development Tools
- ✅ **Essential build tools** (gcc, make, etc.)
- ✅ **Package managers** (npm, yarn, pip)
- ✅ **Process managers** (pm2)
- ✅ **Text editors** (vim, nano)
- ✅ **System utilities** (htop, tree, jq)

## 🎯 Quick Start

### For Fresh Ubuntu/WSL Installation:

```bash
# 1. Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/your-repo/Garissa-e-commerce/main/setup.sh | bash

# OR if you have the project locally:
cd /path/to/Garissa-e-commerce
./setup.sh
```

### What Happens During Setup:

1. **System Update**: Updates all system packages
2. **Tool Installation**: Installs all development tools
3. **Project Setup**: Clones and configures the project
4. **Database Setup**: Creates PostgreSQL database and user
5. **Environment Setup**: Creates .env files and virtual environments
6. **Dependencies**: Installs all Python and Node.js dependencies
7. **Admin User**: Creates default admin user
8. **Scripts**: Creates convenient startup scripts
9. **Extensions**: Installs VS Code extensions
10. **Documentation**: Generates setup completion guide

## 📁 Generated Files

After running the script, you'll have:

```
Garissa-e-commerce/
├── setup.sh                 # This setup script
├── start-project.sh         # Start both frontend & backend
├── start-backend.sh         # Start backend only
├── start-frontend.sh        # Start frontend only
├── reset-database.sh        # Reset database
├── SETUP_COMPLETE.md        # Detailed setup guide
├── Backend/
│   ├── .env                 # Backend environment variables
│   └── venv/                # Python virtual environment
└── Frontend/
    └── .env                 # Frontend environment variables
```

## 🚀 After Setup

### Start the Application:
```bash
# Start everything at once
./start-project.sh

# Or start individually
./start-backend.sh    # Terminal 1
./start-frontend.sh   # Terminal 2
```

### Access the Application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Login**: http://localhost:5173/admin
  - Email: `admin@garissa.com`
  - Password: `Admin123`

## 🔧 Database Information

- **Database**: `garissa_ecommerce`
- **User**: `garissa_user`
- **Password**: `garissa_password`
- **Host**: `localhost:5432`

## 🛠️ Development Commands

```bash
# Reset database and recreate admin user
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

## 📝 Prerequisites

- **Ubuntu 20.04+** or **WSL2** with Ubuntu
- **Internet connection** for downloading packages
- **sudo privileges** for system package installation
- **Git** (will be installed if not present)

## ⚠️ Important Notes

1. **Restart Required**: You may need to restart your terminal or run `source ~/.bashrc` after setup
2. **Docker Group**: You'll need to log out and back in to use Docker without sudo
3. **VS Code**: If VS Code was already installed, it will be updated
4. **Git Config**: The script will prompt for your Git username and email if not configured

## 🐛 Troubleshooting

### If the script fails:
1. Check your internet connection
2. Ensure you have sudo privileges
3. Try running individual sections manually
4. Check the error messages for specific issues

### Common Issues:
- **Permission denied**: Make sure you have sudo access
- **Package not found**: Update package lists with `sudo apt update`
- **Port already in use**: Stop existing services on ports 5000 and 5173

## 📞 Support

If you encounter issues:
1. Check the `SETUP_COMPLETE.md` file generated after setup
2. Review the error messages in the terminal
3. Ensure all prerequisites are met
4. Try running the script in a fresh Ubuntu environment

## 🎉 Success!

After successful setup, you'll have a fully functional development environment with:
- ✅ All dependencies installed
- ✅ Database configured
- ✅ Admin user created
- ✅ Development scripts ready
- ✅ VS Code configured
- ✅ Project ready to run

Happy coding! 🚀
