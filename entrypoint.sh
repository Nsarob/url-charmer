#!/bin/sh
set -e

# Run migrations
echo "Running migrations..."
node dist/src/database/connection/migrate/index.js

# Start the application
echo "Starting the application..."
exec node dist/src/index.js