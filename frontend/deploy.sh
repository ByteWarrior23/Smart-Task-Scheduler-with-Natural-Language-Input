#!/bin/bash

# Deployment script for TaskFlow Frontend
# Usage: ./deploy.sh [environment]
# Environments: dev, staging, production

set -e

ENVIRONMENT=${1:-production}
echo "🚀 Deploying to $ENVIRONMENT..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 20+"
    exit 1
fi

print_status "Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_status "npm version: $(npm --version)"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run linter
print_status "Running linter..."
npm run lint || {
    print_warning "Linting failed. Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
}

# Run tests
print_status "Running tests..."
npm test -- --run || {
    print_warning "Tests failed. Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
}

# Build for production
print_status "Building for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed. dist/ directory not found"
    exit 1
fi

print_status "Build successful! Output in dist/"

# Environment-specific deployment
case $ENVIRONMENT in
    dev)
        print_status "Deploying to development environment..."
        print_warning "Starting preview server..."
        npm run preview
        ;;
    
    staging)
        print_status "Deploying to staging environment..."
        print_warning "Manual deployment required. Upload dist/ to staging server."
        ;;
    
    production)
        print_status "Deploying to production environment..."
        
        # Check if Docker is available
        if command -v docker &> /dev/null; then
            print_status "Building Docker image..."
            docker build -t taskflow-frontend:latest .
            docker build -t taskflow-frontend:$(git rev-parse --short HEAD) .
            print_status "Docker images built successfully!"
            
            print_warning "To push to registry:"
            echo "  docker tag taskflow-frontend:latest your-registry/taskflow-frontend:latest"
            echo "  docker push your-registry/taskflow-frontend:latest"
        else
            print_warning "Docker not found. Skipping Docker build."
        fi
        
        print_status "Production build complete!"
        print_warning "Next steps:"
        echo "  1. Upload dist/ to your server"
        echo "  2. Or push Docker image to registry"
        echo "  3. Configure environment variables"
        echo "  4. Update DNS if needed"
        ;;
    
    *)
        print_error "Unknown environment: $ENVIRONMENT"
        echo "Usage: ./deploy.sh [dev|staging|production]"
        exit 1
        ;;
esac

print_status "Deployment process completed!"
