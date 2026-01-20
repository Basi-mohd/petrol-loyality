#!/bin/bash

set -e

echo "Setting up PostgreSQL database for Petrol Loyalty..."

DB_NAME="petrol_loyalty"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo "Creating database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: $DB_HOST:$DB_PORT"

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database $DB_NAME might already exist"

echo "Database setup complete!"
echo "Run migrations with: npm run migration:run"
