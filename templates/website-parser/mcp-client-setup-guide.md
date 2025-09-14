# MCP Client Setup Guide for Playwright MCP

## Overview

This guide explains how to properly configure the **MCP Client node** in n8n to work with the official [Microsoft Playwright MCP server](https://github.com/microsoft/playwright-mcp).

## Prerequisites

### 1. Install Playwright MCP Server
```bash
# Install the official Microsoft Playwright MCP server
npm install -g @playwright/mcp

# Or install from the repository
npm install -g @microsoft/playwright-mcp
```

### 2. Start the Playwright MCP Server
```bash
# Start the server (default port 3000)
npx @playwright/mcp

# Or specify a custom port
npx @playwright/mcp --port 3001

# For development with additional capabilities
npx @playwright/mcp --caps=vision,pdf,verify
```

## MCP Client Node Configuration

### **Endpoint Configuration**
- **URL**: `http://localhost:3000/mcp`
- **Port**: Default is 3000, but you can change it when starting the server
- **Protocol**: HTTP (for local development)

### **Server Transport**
- **Setting**: `Server Sent Events (Deprecated)`
- **Note**: Even though marked as deprecated, this is the standard transport method for MCP servers
- **Alternative**: If available, you can try other transport methods

### **Authentication**
- **Setting**: `None` (for local development)
- **Production**: If deploying to production, consider adding API key authentication

### **Tools to Include**
- **Setting**: `All` (recommended)
- **Purpose**: Gives the AI Agent access to all available Playwright MCP tools

## Available Playwright MCP Tools

Based on the [official Microsoft repository](https://github.com/microsoft/playwright-mcp), the AI Agent will have access to these tools:

### **Core Browser Tools**
- **`browser_navigate`**: Navigate to URLs
- **`browser_snapshot`**: Get page content and accessibility info (most important for content extraction)
- **`browser_take_screenshot`**: Capture screenshots
- **`browser_wait_for`**: Wait for content to load

### **Tab Management**
- **`browser_tabs`**: Manage multiple tabs (create, close, switch between tabs)

### **Element Interaction**
- **`browser_click`**: Click on elements
- **`browser_type`**: Type text into forms
- **`browser_select_option`**: Select options in dropdowns
- **`browser_press_key`**: Press keyboard keys

### **Advanced Features (with --caps flags)**
- **Vision capabilities** (`--caps=vision`): Coordinate-based mouse operations
- **PDF generation** (`--caps=pdf`): Save pages as PDF
- **Verification** (`--caps=verify`): Verify element visibility and values

## Step-by-Step Setup

### Step 1: Start the Playwright MCP Server
```bash
# In your terminal
npx @playwright/mcp

# You should see output like:
# Playwright MCP server starting on port 3000
# Available tools: browser_navigate, browser_snapshot, browser_take_screenshot...
```

### Step 2: Configure MCP Client Node in n8n
1. **Open the MCP Client node** in your workflow
2. **Set Endpoint**: `http://localhost:3000/mcp`
3. **Verify connection**: Click "Execute step" to test
4. **Check output**: You should see available tools listed

### Step 3: Test the Connection
- Use the "Execute step" button in the MCP Client node
- Look for output showing available tools
- If successful, you'll see a list of Playwright MCP tools

## Troubleshooting

### **Connection Failed**
```bash
# Check if server is running
curl http://localhost:3000/mcp

# Restart the server
npx @playwright/mcp --port 3000
```

### **Port Already in Use**
```bash
# Use a different port
npx @playwright/mcp --port 3001

# Then update MCP Client endpoint to:
# http://localhost:3001/mcp
```

### **Tools Not Available**
```bash
# Check server output for available tools
# Ensure you're using the latest version
npm update -g @playwright/mcp
```

### **Browser Installation Issues**
```bash
# Install browsers if needed
npx playwright install

# Or use the MCP tool
# The AI Agent can call browser_install if needed
```

## Example AI Agent Workflow

With the MCP Client properly configured, your AI Agent can now:

1. **Navigate to websites**: `browser_navigate` to target URLs
2. **Extract content**: `browser_snapshot` to get page content
3. **Discover links**: Analyze snapshot data to find relevant pages
4. **Take screenshots**: `browser_take_screenshot` for verification
5. **Manage tabs**: `browser_tabs` for parallel processing
6. **Wait for content**: `browser_wait_for` for dynamic content

## Production Considerations

### **Security**
- Add authentication if deploying to production
- Use HTTPS endpoints
- Consider API key restrictions

### **Performance**
- Monitor server resource usage
- Implement rate limiting
- Use appropriate browser capabilities

### **Monitoring**
- Log MCP server activity
- Monitor tool usage
- Track performance metrics

## Advanced Configuration

### **Custom Capabilities**
```bash
# Enable multiple capabilities
npx @playwright/mcp --caps=vision,pdf,verify

# This gives access to:
# - Coordinate-based mouse operations
# - PDF generation
# - Element verification
```

### **Browser Configuration**
```bash
# Use specific browser
npx @playwright/mcp --browser=chromium

# Available options: chromium, firefox, webkit
```

### **Headless Mode**
```bash
# Run in headless mode (default)
npx @playwright/mcp --headless=true

# Show browser for debugging
npx @playwright/mcp --headless=false
```

## Integration with AI Agent

Once the MCP Client is configured, the AI Agent can:

- **Automatically discover** the available tools
- **Use the right tool** for each task
- **Handle errors** gracefully if tools fail
- **Provide detailed progress** updates

The AI Agent will intelligently use these tools to:
1. Navigate to the Fliplet community website
2. Discover article pages by analyzing the site structure
3. Extract content from each page
4. Organize and save the data

This creates a powerful, automated website parsing solution that leverages the full capabilities of Microsoft's Playwright MCP server.
