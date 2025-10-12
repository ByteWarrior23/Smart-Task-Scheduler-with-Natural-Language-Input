#!/bin/bash

echo "🚀 Starting TaskFlow Application..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Starting Backend...${NC}"
cd backend
npm start &
BACKEND_PID=$!

sleep 3

echo ""
echo -e "${BLUE}Starting Frontend...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

sleep 3

echo ""
echo -e "${GREEN}✓ Application started successfully!${NC}"
echo ""
echo -e "${YELLOW}Access the application at:${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}To stop the application:${NC}"
echo "  Press Ctrl+C"
echo ""

wait
