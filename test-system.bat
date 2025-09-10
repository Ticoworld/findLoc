@echo off
setlocal enabledelayedexpansion

REM 🎓 AE-FUNAI Campus Navigator - Complete System Test Script (Windows)
REM This script helps verify all components are working correctly

echo 🚀 Starting AE-FUNAI Campus Navigator System Test...
echo ==================================================

REM Test results tracking
set TESTS_PASSED=0
set TESTS_FAILED=0
set TOTAL_TESTS=0

echo 📁 Checking Project Structure...
echo ================================

REM Check main directories
if exist "src" (
    echo ✅ Found: Frontend source directory
) else (
    echo ❌ Missing: Frontend source directory
)

if exist "src\components" (
    echo ✅ Found: React components directory
) else (
    echo ❌ Missing: React components directory
)

if exist "src\utils" (
    echo ✅ Found: Utilities directory
) else (
    echo ❌ Missing: Utilities directory
)

if exist "src\data" (
    echo ✅ Found: Data directory
) else (
    echo ❌ Missing: Data directory
)

if exist "server" (
    echo ✅ Found: Backend server directory
) else (
    echo ❌ Missing: Backend server directory
)

if exist "server\models" (
    echo ✅ Found: Database models directory
) else (
    echo ❌ Missing: Database models directory
)

if exist "server\routes" (
    echo ✅ Found: API routes directory
) else (
    echo ❌ Missing: API routes directory
)

if exist "public" (
    echo ✅ Found: Public assets directory
) else (
    echo ❌ Missing: Public assets directory
)

echo.
echo 📄 Checking Core Files...
echo =========================

REM Check core frontend files
if exist "src\pages\modernHome.jsx" (
    echo ✅ Found: Main application page
) else (
    echo ❌ Missing: Main application page
)

if exist "src\components\AuthModal.jsx" (
    echo ✅ Found: Authentication component
) else (
    echo ❌ Missing: Authentication component
)

if exist "src\components\PreferencesModal.jsx" (
    echo ✅ Found: Preferences component
) else (
    echo ❌ Missing: Preferences component
)

if exist "src\components\RouteMethodIndicator.jsx" (
    echo ✅ Found: Route method indicator
) else (
    echo ❌ Missing: Route method indicator
)

if exist "src\components\GoogleMapComponent.jsx" (
    echo ✅ Found: Google Maps component
) else (
    echo ❌ Missing: Google Maps component
)

if exist "src\components\SearchModal.jsx" (
    echo ✅ Found: Search modal component
) else (
    echo ❌ Missing: Search modal component
)

if exist "src\utils\aStarPathfinding.js" (
    echo ✅ Found: A* pathfinding algorithm
) else (
    echo ❌ Missing: A* pathfinding algorithm
)

if exist "src\utils\googleMapsService.js" (
    echo ✅ Found: Google Maps service
) else (
    echo ❌ Missing: Google Maps service
)

if exist "src\utils\apiClient.js" (
    echo ✅ Found: API client utilities
) else (
    echo ❌ Missing: API client utilities
)

if exist "src\data\campusShortcuts.js" (
    echo ✅ Found: Campus data and graph
) else (
    echo ❌ Missing: Campus data and graph
)

REM Check backend files
if exist "server\server.js" (
    echo ✅ Found: Express server
) else (
    echo ❌ Missing: Express server
)

if exist "server\models\User.js" (
    echo ✅ Found: User model
) else (
    echo ❌ Missing: User model
)

if exist "server\models\Preferences.js" (
    echo ✅ Found: Preferences model
) else (
    echo ❌ Missing: Preferences model
)

if exist "server\models\Node.js" (
    echo ✅ Found: Campus node model
) else (
    echo ❌ Missing: Campus node model
)

if exist "server\models\Edge.js" (
    echo ✅ Found: Campus edge model
) else (
    echo ❌ Missing: Campus edge model
)

if exist "server\routes\auth.js" (
    echo ✅ Found: Authentication routes
) else (
    echo ❌ Missing: Authentication routes
)

if exist "server\routes\users.js" (
    echo ✅ Found: User management routes
) else (
    echo ❌ Missing: User management routes
)

if exist "server\routes\campus.js" (
    echo ✅ Found: Campus data routes
) else (
    echo ❌ Missing: Campus data routes
)

REM Check configuration files
if exist "package.json" (
    echo ✅ Found: Frontend package.json
) else (
    echo ❌ Missing: Frontend package.json
)

if exist "server\package.json" (
    echo ✅ Found: Backend package.json
) else (
    echo ❌ Missing: Backend package.json
)

if exist "vite.config.js" (
    echo ✅ Found: Vite configuration
) else (
    echo ❌ Missing: Vite configuration
)

if exist "tailwind.config.js" (
    echo ✅ Found: Tailwind configuration
) else (
    echo ❌ Missing: Tailwind configuration
)

if exist ".env" (
    echo ✅ Found: Frontend environment file
) else (
    echo ❌ Missing: Frontend environment file
)

if exist "server\.env" (
    echo ✅ Found: Backend environment file
) else (
    echo ❌ Missing: Backend environment file
)

echo.
echo 🔧 Checking Dependencies...
echo ============================

REM Check if Node.js is installed
node --version >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ Node.js is installed
    node --version
) else (
    echo ❌ Node.js is not installed
)

REM Check if npm is installed
npm --version >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ npm is installed
    npm --version
) else (
    echo ❌ npm is not installed
)

REM Check if MongoDB is available
mongod --version >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ MongoDB found locally
) else (
    echo ⚠️  MongoDB not found locally (using cloud MongoDB?)
)

echo.
echo 📦 Checking Package Dependencies...
echo ===================================

if exist "node_modules" (
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Frontend dependencies not installed
    echo Run: npm install
)

if exist "server\node_modules" (
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Backend dependencies not installed
    echo Run: cd server ^&^& npm install
)

echo.
echo 🌍 Checking Environment Configuration...
echo ========================================

if exist ".env" (
    findstr "VITE_GOOGLE_MAPS_API_KEY" ".env" >nul 2>&1
    if !errorlevel! == 0 (
        echo ✅ Google Maps API key configured
    ) else (
        echo ❌ Google Maps API key not configured
    )
    
    findstr "VITE_API_BASE_URL" ".env" >nul 2>&1
    if !errorlevel! == 0 (
        echo ✅ Backend API URL configured
    ) else (
        echo ⚠️  Backend API URL not configured
    )
) else (
    echo ❌ Frontend .env file missing
)

if exist "server\.env" (
    findstr "MONGODB_URI" "server\.env" >nul 2>&1
    if !errorlevel! == 0 (
        echo ✅ MongoDB URI configured
    ) else (
        echo ❌ MongoDB URI not configured
    )
    
    findstr "JWT_SECRET" "server\.env" >nul 2>&1
    if !errorlevel! == 0 (
        echo ✅ JWT secret configured
    ) else (
        echo ❌ JWT secret not configured
    )
) else (
    echo ❌ Backend .env file missing
)

echo.
echo 🧪 Testing Core Functionality...
echo ================================

echo Testing frontend build...
npm run build >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ Frontend builds successfully
) else (
    echo ❌ Frontend build failed
)

echo.
echo 🎯 Feature Availability Check...
echo ================================

findstr "computeCampusRoute" "src\utils\aStarPathfinding.js" >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ A* pathfinding algorithm implemented
) else (
    echo ❌ A* pathfinding algorithm missing
)

findstr "findOptimalRoute" "src\utils\googleMapsService.js" >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ Google Maps service implemented
) else (
    echo ❌ Google Maps service missing
)

findstr "AuthModal" "src\pages\modernHome.jsx" >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ User authentication integrated
) else (
    echo ❌ User authentication not integrated
)

findstr "PreferencesModal" "src\pages\modernHome.jsx" >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ User preferences integrated
) else (
    echo ❌ User preferences not integrated
)

echo.
echo 🚀 Deployment Readiness...
echo ==========================

if exist "dist" (
    echo ✅ Production build exists
) else (
    echo ⚠️  No production build found (run npm run build)
)

if exist "vercel.json" (
    echo ✅ Vercel deployment configured
)

if exist "netlify.toml" (
    echo ✅ Netlify deployment configured
)

echo.
echo ==============================
echo 🎯 SYSTEM STATUS SUMMARY
echo ==============================

echo.
echo 🔗 Helpful Commands:
echo ===================
echo Start development:
echo   npm run dev                    # Frontend
echo   cd server ^&^& npm run dev      # Backend
echo.
echo Build for production:
echo   npm run build                 # Frontend
echo   npm run preview               # Preview build
echo.
echo Install dependencies:
echo   npm install                   # Frontend
echo   cd server ^&^& npm install      # Backend
echo.
echo Database operations:
echo   mongod                        # Start MongoDB
echo   mongosh                       # MongoDB shell
echo.
echo 📚 Documentation:
echo ==================
echo   README.md           - Project overview and features
echo   DEPLOYMENT_GUIDE.md - Complete deployment instructions
echo   src\data\campusShortcuts.js - Campus data configuration
echo.
echo 💡 Need help? Check the documentation or create an issue on GitHub!
echo.
echo 🎓 Happy Navigating with AE-FUNAI Campus Navigator!

pause
