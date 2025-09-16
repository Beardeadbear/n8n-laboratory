Playwright MCP — Client Setup (n8n)

This README shows how to run the Playwright MCP server in Docker and connect it to n8n as an MCP client. It also covers testing, screenshots, viewport sizing, and troubleshooting.

1) Prerequisites

Docker Desktop (or Docker Engine).

n8n running (Docker or local).

A free TCP port (default: 9978).

On Windows, use PowerShell; on macOS/Linux use bash/zsh.

Note: playwright.config.ts is not used by the MCP server. Viewport and headless must be set per-run or in the server code.

2) Get and build the server image
# macOS/Linux
git clone https://github.com/microsoft/playwright-mcp.git
cd playwright-mcp
docker build -t playwright-mcp-custom .

# Windows PowerShell
git clone https://github.com/microsoft/playwright-mcp.git
cd playwright-mcp
docker build -t playwright-mcp-custom .

3) (Optional) Prepare a screenshots folder on the host
# macOS/Linux
mkdir -p screenshots

# Windows PowerShell (from the repo folder)
mkdir screenshots


This will let the container write screenshots to your local disk.

4) Run the MCP server container
Headless, default viewport (safe for CI)
# macOS/Linux
docker rm -f playwright-mcp 2>/dev/null || true
docker run -d --name playwright-mcp --shm-size=1g \
  -p 9978:9978 \
  -v "$PWD/screenshots:/app/screenshots" \
  playwright-mcp-custom --host 0.0.0.0 --port 9978 --headless

# Windows PowerShell
docker rm -f playwright-mcp 2>$null
docker run -d --name playwright-mcp --shm-size=1g `
  -p 9978:9978 `
  -v "${PWD}\screenshots:/app/screenshots" `
  playwright-mcp-custom --host 0.0.0.0 --port 9978 --headless

(Optional) Headed in Docker

You can run “headed” but you will not see a GUI unless you add a virtual display (Xvfb/VNC). Headless is recommended.

5) Verify the server is up
docker ps
# PORTS column should show 0.0.0.0:9978->9978/tcp

docker logs -f playwright-mcp
# Expect: "Listening on http://localhost:9978"


Test HTTP: (use POST; GET returns “Invalid request”)

# macOS/Linux
curl -s -X POST http://localhost:9978/mcp \
 -H "Content-Type: application/json" \
 -d '{ "id":"1","jsonrpc":"2.0","method":"list_tools","params":{} }'

# Windows — use curl.exe to avoid PowerShell alias
curl.exe -s -X POST http://localhost:9978/mcp ^
 -H "Content-Type: application/json" ^
 -d "{ ""id"":""1"",""jsonrpc"":""2.0"",""method"":""list_tools"",""params"":{} }"


You should get a JSON list of tools like browser_navigate, browser_click, etc.

6) Connect n8n to the MCP server

Add an MCP Client node:

Server Transport: HTTP Streamable

Endpoint (pick one):

If you call from the host: http://localhost:9978/mcp

If n8n runs in Docker on Windows/macOS: http://host.docker.internal:9978/mcp

If both containers are on the same Docker network: http://playwright-mcp:9978/mcp

Authentication: None (unless you’ve added a gateway)

Tools: All

Click Execute. You should see a capabilities response.

7) Minimal test calls from n8n
7.1 Set a viewport (prevents 1024×720 banner)

Put this before your first navigation step each session.

Body (RAW JSON):

{
  "id": "setViewport",
  "jsonrpc": "2.0",
  "method": "call_tool",
  "params": {
    "name": "browser_evaluate",
    "arguments": {
      "code": "await page.setViewportSize({ width: 1366, height: 800 })"
    }
  }
}

7.2 Navigate
{
  "id": "nav",
  "jsonrpc": "2.0",
  "method": "call_tool",
  "params": {
    "name": "browser_navigate",
    "arguments": { "url": "https://example.com" }
  }
}

7.3 Screenshot to your host folder

Save to the container path that is bind-mounted:

{
  "id": "shot",
  "jsonrpc": "2.0",
  "method": "call_tool",
  "params": {
    "name": "browser_screenshot",
    "arguments": {
      "path": "/app/screenshots/test.png",
      "fullPage": true
    }
  }
}


The file will appear on the host at ./screenshots/test.png (or D:\...\screenshots\test.png on Windows).

8) Recommended n8n flow order

MCP Client → set viewport

MCP Client → navigate

MCP Client → fill/click/assert (repeat as needed)

MCP Client → screenshot (optional)

Log results, report, or create Jira issues.

9) Advanced (optional)
9.1 Use a .env file (for your Docker run)

Create .env (next to Dockerfile) only if you have modified the server to read envs:

PW_VIEWPORT_W=1366
PW_VIEWPORT_H=800
PW_HEADLESS=true
SCREENSHOTS_DIR=/app/screenshots


Run with:

docker run -d --name playwright-mcp --shm-size=1g \
  --env-file .env -p 9978:9978 \
  -v "$PWD/screenshots:/app/screenshots" \
  playwright-mcp-custom --host 0.0.0.0 --port 9978


Remember: these envs have effect only if you added code in the server to read them and call page.setViewportSize(...).

9.2 Headed with virtual display (Xvfb)

For debugging:

docker run -d --name playwright-mcp --shm-size=1g \
  -p 9978:9978 \
  playwright-mcp-custom bash -lc \
  "Xvfb :99 -screen 0 1920x1080x24 & exec node cli.js --host 0.0.0.0 --port 9978"

10) Troubleshooting

curl http://localhost:9978/mcp fails

Container not running. Check docker ps.

Port not mapped. Ensure -p 9978:9978 is present.

You started with --rm and closed the terminal → container deleted. Run with -d (detached).

n8n can’t connect

If n8n is a container, use http://host.docker.internal:9978/mcp (Win/Mac).

Or put both containers on the same user-defined network and use http://playwright-mcp:9978/mcp.

Screenshots not visible on host

Ensure you ran with a volume: -v <host>/screenshots:/app/screenshots.

Use the container path in the MCP call: /app/screenshots/<name>.png.

Fliplet “desktop-only” banner

Always call set viewport before navigation.

Example size: 1366×800 or 1920×1080.

PowerShell line breaks

Use backticks ` or put the command on one line. Do not use \.

11) Quick docker-compose example (optional)
version: "3.9"
services:
  mcp-playwright:
    image: playwright-mcp-custom
    container_name: playwright-mcp
    command: ["--host","0.0.0.0","--port","9978","--headless"]
    shm_size: "1g"
    ports: ["9978:9978"]
    volumes:
      - ./screenshots:/app/screenshots
    networks: [mcpnet]

networks:
  mcpnet:
    driver: bridge


n8n MCP Client endpoint (same network): http://mcp-playwright:9978/mcp.

12) Security notes

The MCP server has no auth by default. Do not expose it to the public internet.

Keep it on a private network or behind a gateway.