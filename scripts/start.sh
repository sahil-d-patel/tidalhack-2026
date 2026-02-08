#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting FRACTAL..."

# Start server in background
echo "Starting server..."
cd "$ROOT_DIR/server"
npm run dev &
SERVER_PID=$!

# Start client in background
echo "Starting client..."
cd "$ROOT_DIR/client"
npm run dev &
CLIENT_PID=$!

# Trap to kill both on exit
trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit" INT TERM EXIT

echo ""
echo "Server PID: $SERVER_PID"
echo "Client PID: $CLIENT_PID"
echo "Press Ctrl+C to stop both."
echo ""

wait
