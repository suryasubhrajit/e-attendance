#!/bin/bash

# Database Backup Script
# Supports PostgreSQL, MySQL, and SQLite

set -e

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🗄️  Database Backup Script"
echo "=========================="
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Load environment variables
if [ -f .env.production.local ]; then
    export $(cat .env.production.local | grep DATABASE_URL | xargs)
elif [ -f .env ]; then
    export $(cat .env | grep DATABASE_URL | xargs)
else
    echo -e "${RED}❌ No environment file found${NC}"
    exit 1
fi

# Detect database type from DATABASE_URL
if [[ $DATABASE_URL == postgresql://* ]] || [[ $DATABASE_URL == postgres://* ]]; then
    DB_TYPE="postgresql"
elif [[ $DATABASE_URL == mysql://* ]]; then
    DB_TYPE="mysql"
elif [[ $DATABASE_URL == file:* ]]; then
    DB_TYPE="sqlite"
else
    echo -e "${RED}❌ Unknown database type${NC}"
    exit 1
fi

echo "Database type: $DB_TYPE"
echo "Backup directory: $BACKUP_DIR"
echo ""

# Perform backup based on database type
case $DB_TYPE in
    postgresql)
        # Extract connection details
        DB_URL=${DATABASE_URL#postgresql://}
        DB_URL=${DB_URL#postgres://}
        
        # Parse URL
        if [[ $DB_URL =~ ([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
            DB_USER="${BASH_REMATCH[1]}"
            DB_PASS="${BASH_REMATCH[2]}"
            DB_HOST="${BASH_REMATCH[3]}"
            DB_PORT="${BASH_REMATCH[4]}"
            DB_NAME="${BASH_REMATCH[5]}"
        fi
        
        BACKUP_FILE="$BACKUP_DIR/postgres_${DB_NAME}_${DATE}.sql"
        
        echo "Backing up PostgreSQL database: $DB_NAME"
        PGPASSWORD="$DB_PASS" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"
        
        # Compress backup
        gzip "$BACKUP_FILE"
        BACKUP_FILE="${BACKUP_FILE}.gz"
        ;;
        
    mysql)
        # Extract connection details
        DB_URL=${DATABASE_URL#mysql://}
        
        if [[ $DB_URL =~ ([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
            DB_USER="${BASH_REMATCH[1]}"
            DB_PASS="${BASH_REMATCH[2]}"
            DB_HOST="${BASH_REMATCH[3]}"
            DB_PORT="${BASH_REMATCH[4]}"
            DB_NAME="${BASH_REMATCH[5]}"
        fi
        
        BACKUP_FILE="$BACKUP_DIR/mysql_${DB_NAME}_${DATE}.sql"
        
        echo "Backing up MySQL database: $DB_NAME"
        mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_FILE"
        
        # Compress backup
        gzip "$BACKUP_FILE"
        BACKUP_FILE="${BACKUP_FILE}.gz"
        ;;
        
    sqlite)
        # Extract file path
        DB_FILE=${DATABASE_URL#file:}
        DB_FILE=${DB_FILE#./}
        
        BACKUP_FILE="$BACKUP_DIR/sqlite_${DATE}.db"
        
        echo "Backing up SQLite database: $DB_FILE"
        cp "$DB_FILE" "$BACKUP_FILE"
        
        # Compress backup
        gzip "$BACKUP_FILE"
        BACKUP_FILE="${BACKUP_FILE}.gz"
        ;;
esac

# Check if backup was successful
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✅ Backup successful!${NC}"
    echo "File: $BACKUP_FILE"
    echo "Size: $BACKUP_SIZE"
else
    echo -e "${RED}❌ Backup failed!${NC}"
    exit 1
fi

echo ""
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.db.gz" -mtime +$RETENTION_DAYS -delete

echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""
echo "Backup location: $BACKUP_FILE"
echo ""
echo "To restore this backup:"
case $DB_TYPE in
    postgresql)
        echo "  gunzip -c $BACKUP_FILE | psql -h \$DB_HOST -U \$DB_USER \$DB_NAME"
        ;;
    mysql)
        echo "  gunzip -c $BACKUP_FILE | mysql -h \$DB_HOST -u \$DB_USER -p \$DB_NAME"
        ;;
    sqlite)
        echo "  gunzip -c $BACKUP_FILE > restored.db"
        ;;
esac
