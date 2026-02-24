#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install dependencies
npm install

# Start dev server in background if not already running
if ! curl -sf http://localhost:8080/Kaikiei-Group-Site-Codex/ > /dev/null 2>&1; then
  nohup npm run dev > /tmp/vite-dev.log 2>&1 &
  echo "Dev server started (PID: $!)"
fi
