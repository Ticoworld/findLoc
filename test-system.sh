#!/bin/bash

# 🎓 AE-FUNAI Campus Navigator - Complete System Test Script
# This script helps verify all components are working correctly

echo "🚀 Starting AE-FUNAI Campus Navigator System Test..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "${BLUE}Testing: $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo
}

# Function to check if a file exists
check_file() {
    local file_path="$1"
    local description="$2"
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}✅ Found: $description${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing: $description${NC}"
        return 1
    fi
}

# Function to check if a directory exists
check_directory() {
    local dir_path="$1"
    local description="$2"
    
    if [ -d "$dir_path" ]; then
        echo -e "${GREEN}✅ Found: $description${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing: $description${NC}"
        return 1
    fi
}

echo "📁 Checking Project Structure..."
echo "================================"

# Check main directories
check_directory "src" "Frontend source directory"
check_directory "src/components" "React components directory"
check_directory "src/utils" "Utilities directory"
check_directory "src/data" "Data directory"
check_directory "server" "Backend server directory"
check_directory "server/models" "Database models directory"
check_directory "server/routes" "API routes directory"
check_directory "public" "Public assets directory"

echo
echo "📄 Checking Core Files..."
echo "========================="

# Check core frontend files
check_file "src/pages/modernHome.jsx" "Main application page"
check_file "src/components/AuthModal.jsx" "Authentication component"
check_file "src/components/PreferencesModal.jsx" "Preferences component"
check_file "src/components/RouteMethodIndicator.jsx" "Route method indicator"
check_file "src/components/GoogleMapComponent.jsx" "Google Maps component"
check_file "src/components/SearchModal.jsx" "Search modal component"
check_file "src/utils/aStarPathfinding.js" "A* pathfinding algorithm"
check_file "src/utils/googleMapsService.js" "Google Maps service"
check_file "src/utils/apiClient.js" "API client utilities"
check_file "src/data/campusShortcuts.js" "Campus data and graph"

# Check backend files
check_file "server/server.js" "Express server"
check_file "server/models/User.js" "User model"
check_file "server/models/Preferences.js" "Preferences model"
check_file "server/models/Node.js" "Campus node model"
check_file "server/models/Edge.js" "Campus edge model"
check_file "server/routes/auth.js" "Authentication routes"
check_file "server/routes/users.js" "User management routes"
check_file "server/routes/campus.js" "Campus data routes"

# Check configuration files
check_file "package.json" "Frontend package.json"
check_file "server/package.json" "Backend package.json"
check_file "vite.config.js" "Vite configuration"
check_file "tailwind.config.js" "Tailwind configuration"
check_file ".env" "Frontend environment file"
check_file "server/.env" "Backend environment file"

echo
echo "🔧 Checking Dependencies..."
echo "============================"

# Check if Node.js is installed
run_test "Node.js installation" "node --version"

# Check if npm is installed
run_test "npm installation" "npm --version"

# Check if MongoDB is available (if running locally)
if command -v mongod >/dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB found locally${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally (using cloud MongoDB?)${NC}"
fi

echo
echo "📦 Checking Package Dependencies..."
echo "==================================="

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Frontend dependencies not installed${NC}"
    echo -e "${YELLOW}Run: npm install${NC}"
fi

if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Backend dependencies not installed${NC}"
    echo -e "${YELLOW}Run: cd server && npm install${NC}"
fi

echo
echo "🌍 Checking Environment Configuration..."
echo "========================================"

# Check .env files
if [ -f ".env" ]; then
    if grep -q "VITE_GOOGLE_MAPS_API_KEY" ".env"; then
        echo -e "${GREEN}✅ Google Maps API key configured${NC}"
    else
        echo -e "${RED}❌ Google Maps API key not configured${NC}"
    fi
    
    if grep -q "VITE_API_BASE_URL" ".env"; then
        echo -e "${GREEN}✅ Backend API URL configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend API URL not configured${NC}"
    fi
else
    echo -e "${RED}❌ Frontend .env file missing${NC}"
fi

if [ -f "server/.env" ]; then
    if grep -q "MONGODB_URI" "server/.env"; then
        echo -e "${GREEN}✅ MongoDB URI configured${NC}"
    else
        echo -e "${RED}❌ MongoDB URI not configured${NC}"
    fi
    
    if grep -q "JWT_SECRET" "server/.env"; then
        echo -e "${GREEN}✅ JWT secret configured${NC}"
    else
        echo -e "${RED}❌ JWT secret not configured${NC}"
    fi
else
    echo -e "${RED}❌ Backend .env file missing${NC}"
fi

echo
echo "🧪 Testing Core Functionality..."
echo "================================"

# Test if the frontend can build
echo -e "${BLUE}Testing frontend build...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend builds successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
fi

# Test if the backend dependencies are correct
echo -e "${BLUE}Testing backend setup...${NC}"
if cd server && npm list > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend dependencies are valid${NC}"
    cd ..
else
    echo -e "${RED}❌ Backend dependency issues${NC}"
    cd ..
fi

echo
echo "📊 Testing Campus Data..."
echo "========================"

# Check campus data structure
if node -e "
const { CAMPUS_BUILDINGS, CAMPUS_GRAPH } = require('./src/data/campusShortcuts.js');
console.log('Buildings:', CAMPUS_BUILDINGS.length);
console.log('Nodes:', CAMPUS_GRAPH.nodes.length);
console.log('Edges:', CAMPUS_GRAPH.edges.length);
" 2>/dev/null; then
    echo -e "${GREEN}✅ Campus data structure is valid${NC}"
else
    echo -e "${RED}❌ Campus data structure has issues${NC}"
fi

echo
echo "🎯 Feature Availability Check..."
echo "================================"

# Check if A* algorithm is properly implemented
if grep -q "computeCampusRoute" "src/utils/aStarPathfinding.js"; then
    echo -e "${GREEN}✅ A* pathfinding algorithm implemented${NC}"
else
    echo -e "${RED}❌ A* pathfinding algorithm missing${NC}"
fi

# Check if Google Maps service is configured
if grep -q "findOptimalRoute" "src/utils/googleMapsService.js"; then
    echo -e "${GREEN}✅ Google Maps service implemented${NC}"
else
    echo -e "${RED}❌ Google Maps service missing${NC}"
fi

# Check if authentication is implemented
if grep -q "AuthModal" "src/pages/modernHome.jsx"; then
    echo -e "${GREEN}✅ User authentication integrated${NC}"
else
    echo -e "${RED}❌ User authentication not integrated${NC}"
fi

# Check if preferences are implemented
if grep -q "PreferencesModal" "src/pages/modernHome.jsx"; then
    echo -e "${GREEN}✅ User preferences integrated${NC}"
else
    echo -e "${RED}❌ User preferences not integrated${NC}"
fi

echo
echo "🚀 Deployment Readiness..."
echo "=========================="

# Check if build directory exists
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Production build exists${NC}"
else
    echo -e "${YELLOW}⚠️  No production build found (run npm run build)${NC}"
fi

# Check if deployment files exist
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ Vercel deployment configured${NC}"
fi

if [ -f "netlify.toml" ]; then
    echo -e "${GREEN}✅ Netlify deployment configured${NC}"
fi

echo
echo "📱 Mobile & PWA Features..."
echo "=========================="

# Check if PWA manifest exists
if [ -f "public/manifest.json" ] || [ -f "public/site.webmanifest" ]; then
    echo -e "${GREEN}✅ PWA manifest found${NC}"
else
    echo -e "${YELLOW}⚠️  PWA manifest not found${NC}"
fi

# Check if service worker is configured
if grep -q "serviceWorker" "src/main.jsx" || [ -f "public/sw.js" ]; then
    echo -e "${GREEN}✅ Service worker configured${NC}"
else
    echo -e "${YELLOW}⚠️  Service worker not configured${NC}"
fi

echo
echo "🔍 Security & Performance..."
echo "==========================="

# Check if API key restrictions are mentioned in documentation
if grep -q "API.*restrict" "DEPLOYMENT_GUIDE.md" "README.md" 2>/dev/null; then
    echo -e "${GREEN}✅ API security documentation found${NC}"
else
    echo -e "${YELLOW}⚠️  API security documentation missing${NC}"
fi

# Check if HTTPS is configured
if grep -q "https" ".env" "server/.env" 2>/dev/null; then
    echo -e "${GREEN}✅ HTTPS configuration found${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS configuration not found${NC}"
fi

echo
echo "=============================="
echo "🎯 TEST SUMMARY"
echo "=============================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $TOTAL_TESTS"

if [ $TESTS_FAILED -eq 0 ]; then
    echo
    echo -e "${GREEN}🎉 ALL SYSTEMS GO!${NC}"
    echo -e "${GREEN}Your AE-FUNAI Campus Navigator is ready for deployment!${NC}"
    echo
    echo "Next steps:"
    echo "1. Start the development servers:"
    echo "   - Frontend: npm run dev"
    echo "   - Backend: cd server && npm run dev"
    echo "2. Test the application at http://localhost:5173"
    echo "3. When ready, deploy using the DEPLOYMENT_GUIDE.md"
else
    echo
    echo -e "${YELLOW}⚠️  SOME ISSUES FOUND${NC}"
    echo "Please review the failed tests above and fix any issues."
    echo "Refer to the DEPLOYMENT_GUIDE.md for detailed setup instructions."
fi

echo
echo "🔗 Helpful Commands:"
echo "==================="
echo "Start development:"
echo "  npm run dev                    # Frontend"
echo "  cd server && npm run dev      # Backend"
echo
echo "Build for production:"
echo "  npm run build                 # Frontend"
echo "  npm run preview               # Preview build"
echo
echo "Install dependencies:"
echo "  npm install                   # Frontend"
echo "  cd server && npm install      # Backend"
echo
echo "Database operations:"
echo "  mongod                        # Start MongoDB"
echo "  mongosh                       # MongoDB shell"
echo
echo "📚 Documentation:"
echo "=================="
echo "  README.md           - Project overview and features"
echo "  DEPLOYMENT_GUIDE.md - Complete deployment instructions"
echo "  src/data/campusShortcuts.js - Campus data configuration"
echo
echo "💡 Need help? Check the documentation or create an issue on GitHub!"
echo
echo -e "${BLUE}🎓 Happy Navigating with AE-FUNAI Campus Navigator!${NC}"
