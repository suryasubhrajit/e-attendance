#!/bin/bash

# Production Setup Script for KMBB CET Attendance System
# This script automates the production deployment process

set -e  # Exit on error

echo "🚀 KMBB CET Attendance System - Production Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"
echo ""

# Check if .env.production.local exists
if [ ! -f .env.production.local ]; then
    echo -e "${YELLOW}⚠️  .env.production.local not found${NC}"
    echo "Creating from .env.example..."
    cp .env.example .env.production.local
    echo -e "${YELLOW}⚠️  Please edit .env.production.local with your production values${NC}"
    echo "Press Enter to continue after editing, or Ctrl+C to exit..."
    read
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "🗄️  Setting up database..."
echo "This will push the schema to your production database."
echo "Make sure DATABASE_URL in .env.production.local is correct!"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

npx prisma db push

echo ""
echo "🌱 Seeding database with initial data..."
read -p "Seed database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:seed
fi

echo ""
echo "🔍 Running linting checks..."
npm run lint

echo ""
echo "🏗️  Building production bundle..."
npm run build

echo ""
echo -e "${GREEN}✅ Production setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Review your .env.production.local file"
echo "2. Start the production server: npm start"
echo "3. Or use PM2: pm2 start npm --name 'attendance' -- start"
echo ""
echo "Default credentials:"
echo "  Admin: admin@kmbb.in / admin123"
echo "  Teacher: priya.sharma@kmbb.in / teacher123"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Change default passwords immediately!${NC}"
echo ""
echo "For more information, see PRODUCTION_SETUP.md"
