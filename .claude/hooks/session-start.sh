#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install dependencies
npm install

# Always build fresh to get new hashed bundle URLs (bypasses proxy cache)
echo "Building fresh bundle..."
npm run build:local > /tmp/vite-build.log 2>&1 && echo "Build complete"

# Start preview server (serves built dist/ with hashed URLs)
if ! curl -sf http://localhost:8080/ > /dev/null 2>&1; then
  nohup npm run preview:local > /tmp/vite-dev.log 2>&1 &
  echo "Dev server started (PID: $!)"
fi
