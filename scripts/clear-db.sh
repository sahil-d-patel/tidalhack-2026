#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Load MONGODB_URI from server .env
if [ -f "$ROOT_DIR/server/.env" ]; then
  MONGODB_URI=$(grep '^MONGODB_URI=' "$ROOT_DIR/server/.env" | cut -d '=' -f2-)
fi

if [ -z "$MONGODB_URI" ]; then
  echo "Error: MONGODB_URI not found in server/.env"
  exit 1
fi

echo "Clearing database..."
echo "URI: ${MONGODB_URI%%@*}@***"

# Extract DB name from URI (last path segment before query params)
DB_NAME=$(echo "$MONGODB_URI" | sed -n 's|.*/\([^?]*\).*|\1|p')

if [ -z "$DB_NAME" ]; then
  echo "Error: Could not extract database name from URI"
  exit 1
fi

echo "Database: $DB_NAME"
echo ""

# Use mongosh if available, fall back to node+mongoose
if command -v mongosh &>/dev/null; then
  mongosh "$MONGODB_URI" --eval "db.dropDatabase()" --quiet
  echo "Database cleared via mongosh."
else
  cd "$ROOT_DIR/server"
  node --input-type=module -e "
    import mongoose from 'mongoose';
    await mongoose.connect('$MONGODB_URI');
    await mongoose.connection.dropDatabase();
    console.log('All collections dropped.');
    await mongoose.disconnect();
  "
  echo "Database cleared via mongoose."
fi
