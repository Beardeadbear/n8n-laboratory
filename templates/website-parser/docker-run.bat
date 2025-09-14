@echo off
echo 🚀 Starting Playwright MCP Server in Docker...

REM Pull the latest image
docker pull mcr.microsoft.com/playwright/mcp:latest

REM Run the container
docker run -d --name playwright-mcp-server -p 3000:3000 --restart unless-stopped mcr.microsoft.com/playwright/mcp:latest --caps=vision,pdf,verify

echo ✅ Playwright MCP Server started on port 3000
echo 🌐 Endpoint: http://localhost:3000/mcp
echo.
echo To check logs: docker logs playwright-mcp-server
echo To stop: docker stop playwright-mcp-server
echo To remove: docker rm playwright-mcp-server
pause
