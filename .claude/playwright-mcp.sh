#!/usr/bin/env bash
# Starts the Playwright MCP server for Claude Code.
# In Claude Code cloud sessions a Chromium is preinstalled at /opt/pw-browsers;
# use it so nothing has to be downloaded. Elsewhere, Playwright's own browser is used
# (install once with: npx @playwright/mcp@0.0.84 install-browser chrome-for-testing).
set -euo pipefail
args=(--headless --isolated)
if [ -x /opt/pw-browsers/chromium ]; then
  args+=(--browser chromium --executable-path /opt/pw-browsers/chromium --no-sandbox)
fi
exec npx -y @playwright/mcp@0.0.84 "${args[@]}" "$@"
