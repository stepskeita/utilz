#!/bin/bash

# =============================================================================
# iUtility Development Setup Script
# =============================================================================

set -e

echo "🚀 Setting up iUtility development environment..."

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

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Check if MySQL is installed
check_mysql() {
    print_status "Checking MySQL installation..."
    if ! command -v mysql &> /dev/null; then
        print_warning "MySQL is not installed. Please install MySQL v8.0 or higher."
        print_warning "You can continue with the setup, but database operations will fail."
    else
        print_success "MySQL is installed"
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Creating backend environment file..."
        cp env.example .env
        print_warning "Please configure the .env file with your database and API settings"
    else
        print_success "Backend environment file already exists"
    fi
    
    cd ..
}

# Setup admin system
setup_admin() {
    print_status "Setting up admin system..."
    
    cd admin-system
    
    # Install dependencies
    print_status "Installing admin system dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Creating admin system environment file..."
        cp env.example .env
        print_warning "Please configure the .env file with your API settings"
    else
        print_success "Admin system environment file already exists"
    fi
    
    cd ..
}

# Setup client portal
setup_client() {
    print_status "Setting up client portal..."
    
    cd client-portal
    
    # Install dependencies
    print_status "Installing client portal dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Creating client portal environment file..."
        cp env.example .env
        print_warning "Please configure the .env file with your API settings"
    else
        print_success "Client portal environment file already exists"
    fi
    
    cd ..
}

# Create database
create_database() {
    print_status "Creating database..."
    
    read -p "Enter MySQL root password (or press Enter if no password): " MYSQL_ROOT_PASSWORD
    
    if [ -z "$MYSQL_ROOT_PASSWORD" ]; then
        mysql -u root -e "CREATE DATABASE IF NOT EXISTS iutility CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    else
        mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS iutility CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    fi
    
    print_success "Database 'iutility' created successfully"
}

# Run migrations
run_migrations() {
    print_status "Running database migrations..."
    
    cd backend
    
    # Check if .env exists
    if [ ! -f .env ]; then
        print_error "Backend .env file not found. Please run setup first."
        exit 1
    fi
    
    # Run migrations
    npm run migrate:up
    
    cd ..
    
    print_success "Database migrations completed"
}

# Create logs directory
create_logs() {
    print_status "Creating logs directory..."
    
    mkdir -p backend/logs
    mkdir -p backend/uploads
    
    print_success "Logs and uploads directories created"
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 iUtility development environment setup completed!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Configure environment files:"
    echo "   - Backend: iutility/backend/.env"
    echo "   - Admin System: iutility/admin-system/.env"
    echo "   - Client Portal: iutility/client-portal/.env"
    echo ""
    echo "2. Start the development servers:"
    echo "   # Terminal 1 - Backend"
    echo "   cd iutility/backend && npm run dev"
    echo ""
    echo "   # Terminal 2 - Admin System"
    echo "   cd iutility/admin-system && npm run dev"
    echo ""
    echo "   # Terminal 3 - Client Portal"
    echo "   cd iutility/client-portal && npm run dev"
    echo ""
    echo "3. Access the applications:"
    echo "   - Backend API: http://localhost:9000"
    echo "   - Admin System: http://localhost:3001"
    echo "   - Client Portal: http://localhost:3000"
    echo ""
    echo "📚 Documentation:"
    echo "   - Configuration Guide: CONFIGURATION.md"
    echo "   - Migration Guide: backend/src/migrations/README.md"
    echo ""
}

# Main setup function
main() {
    echo "============================================================================="
    echo "iUtility Development Environment Setup"
    echo "============================================================================="
    echo ""
    
    # Check prerequisites
    check_nodejs
    check_npm
    check_mysql
    
    echo ""
    
    # Setup components
    setup_backend
    setup_admin
    setup_client
    
    echo ""
    
    # Create logs directory
    create_logs
    
    echo ""
    
    # Ask about database setup
    read -p "Do you want to create the database now? (y/N): " CREATE_DB
    if [[ $CREATE_DB =~ ^[Yy]$ ]]; then
        create_database
        
        echo ""
        
        # Ask about running migrations
        read -p "Do you want to run database migrations now? (y/N): " RUN_MIGRATIONS
        if [[ $RUN_MIGRATIONS =~ ^[Yy]$ ]]; then
            run_migrations
        else
            print_warning "Remember to run migrations later: cd backend && npm run migrate:up"
        fi
    else
        print_warning "Remember to create the database and run migrations later"
    fi
    
    echo ""
    
    # Show next steps
    show_next_steps
}

# Run main function
main "$@" 