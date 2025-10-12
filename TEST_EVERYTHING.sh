#!/bin/bash

echo "🚀 TaskFlow - Complete System Test"
echo "=================================="
echo ""

# Check backend
echo "📡 Checking Backend..."
if cd backend && npm list express &>/dev/null; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependencies missing - run: cd backend && npm install"
fi

# Check frontend
echo ""
echo "🎨 Checking Frontend..."
cd /workspace
if cd frontend && npm list react &>/dev/null; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies missing - run: cd frontend && npm install"
fi

# File counts
echo ""
echo "📊 Project Statistics:"
echo "  - Frontend TypeScript files: $(find /workspace/frontend/src -name '*.tsx' -o -name '*.ts' 2>/dev/null | wc -l)"
echo "  - Backend JavaScript files: $(find /workspace/backend/src -name '*.js' 2>/dev/null | wc -l)"
echo "  - Documentation files: $(find /workspace -name '*.md' 2>/dev/null | wc -l)"

echo ""
echo "📚 Documentation Available:"
cd /workspace
ls -1 *.md 2>/dev/null | sed 's/^/  - /'

echo ""
echo "🎯 To Start the Application:"
echo "  1. Backend:  cd backend && npm start"
echo "  2. Frontend: cd frontend && npm run dev"
echo "  3. Visit:    http://localhost:5173"
echo ""
echo "✨ Enjoy your stunning TaskFlow application!"
