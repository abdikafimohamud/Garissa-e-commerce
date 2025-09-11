#!/bin/bash
# Activation script for Garissa E-commerce Backend Virtual Environment

echo "🚀 Activating Garissa E-commerce Backend Virtual Environment..."
source venv/bin/activate
echo "✅ Virtual environment activated!"
echo "📦 Installed packages:"
pip list
echo ""
echo "🔧 To run the Flask application:"
echo "   python run.py"
echo ""
echo "🛑 To deactivate the virtual environment:"
echo "   deactivate"
