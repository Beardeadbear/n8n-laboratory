# AI Agent MCP Website Parser Setup Guide

## What This Workflow Does

This workflow uses an **AI Agent with MCP (Model Context Protocol) tools** to intelligently parse websites:

1. **AI Agent receives instructions** to parse a specific website
2. **Uses MCP tools** to navigate, discover pages, and extract content
3. **Intelligently processes** the website structure and content
4. **Saves structured data** to Google Drive as a JSON file

## Why This Approach is Better

✅ **Simpler Workflow**: Only 5 nodes instead of complex manual scraping
✅ **AI Intelligence**: The agent can adapt to different website structures
✅ **MCP Integration**: Direct access to Playwright and file system tools
✅ **Automatic Discovery**: AI finds relevant pages without manual configuration
✅ **Structured Output**: Clean, organized data ready for analysis

## Prerequisites

### 1. MCP Server Setup
```bash
# Install Playwright MCP server
npm install -g @modelcontextprotocol/server-playwright

# Start the server
npx @modelcontextprotocol/server-playwright
```

### 2. n8n Requirements
- n8n with MCP support enabled
- OpenAI API credentials configured
- Google Drive API credentials configured

## Quick Setup

### Step 1: Import the Workflow
1. Copy the content from `ai-agent-mcp-website-parser.json`
2. In n8n: **Workflows** → **Import from file**
3. Paste the JSON and click **Import**

### Step 2: Configure MCP Connection
1. In the **AI Agent** node, verify MCP tools are configured
2. Ensure the Playwright MCP server is running
3. Test the MCP connection

### Step 3: Set Up Credentials
1. **OpenAI**: Configure your API key for the AI Agent
2. **Google Drive**: Set up OAuth2 credentials
3. **Update folder ID**: Replace the `parents` field in Google Drive node

### Step 4: Customize Target Website
In **Code: Configuration** node, modify:
```javascript
const websiteConfig = {
  targetUrl: "https://your-website.com",  // Change this
  description: "Your custom description",
  maxPages: 100  // Adjust limit
};
```

## How It Works

### Node 1: Manual Trigger
- Starts the workflow

### Node 2: Configuration
- Defines target website and instructions
- Passes configuration to AI Agent

### Node 3: AI Agent with MCP Tools
- **Receives instructions** to parse the website
- **Uses MCP tools** to:
  - Navigate to the website
  - Discover article/documentation pages
  - Extract content from each page
  - Organize data into structured format
- **Provides detailed progress** and results

### Node 4: Process Response
- Extracts structured data from AI response
- Handles both JSON and text responses
- Generates filename with timestamp

### Node 5: Save to Google Drive
- Creates JSON file with all extracted content
- Saves to your specified Google Drive folder

### Node 6: Success Notification
- Confirms completion with summary
- Shows file link and AI agent report

## MCP Tools Available

The AI Agent has access to these MCP tools:

### Playwright Tools
- **`navigate`**: Go to specific URLs
- **`get_content`**: Extract content using CSS selectors
- **`extract_links`**: Find relevant links on pages
- **`screenshot`**: Capture page screenshots

### File System Tools
- **`write_file`**: Save data to local files

## Customization Options

### Change Target Website
```javascript
// In Code: Configuration node
targetUrl: "https://your-website.com"
```

### Modify AI Instructions
```javascript
// Customize what the AI should do
instructions: `Your custom instructions here...`
```

### Adjust MCP Tool Parameters
```javascript
// In AI Agent node, modify tool parameters
"parameters": {
  "selectors": ["your", "custom", "selectors"],
  "patterns": ["/your/", "/patterns/"]
}
```

### Change Output Format
```javascript
// Modify the data structure in Process Response node
let extractedData = {
  // Your custom structure
};
```

## Example AI Agent Workflow

The AI Agent will typically:

1. **Navigate** to the target website
2. **Analyze** the site structure and navigation
3. **Discover** relevant pages by following links
4. **Extract** content from each discovered page
5. **Organize** data into categories and structure
6. **Save** everything to a comprehensive JSON file

## Troubleshooting

### MCP Connection Issues
- Ensure Playwright MCP server is running
- Check server URL and port configuration
- Verify MCP tools are properly configured in n8n

### AI Agent Errors
- Check OpenAI API key and quota
- Verify the model selection (GPT-4 recommended)
- Check tool parameter formatting

### Google Drive Issues
- Verify OAuth2 credentials
- Check folder ID and permissions
- Ensure Google Drive API is enabled

## Expected Output

The workflow will create a JSON file containing:

```json
{
  "website": "https://community.fliplet.com",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "pages": [
    {
      "url": "https://community.fliplet.com/help/getting-started",
      "title": "Getting Started Guide",
      "content": "Cleaned HTML content...",
      "metadata": {
        "author": "Fliplet Team",
        "category": "Help",
        "wordCount": 1250
      }
    }
  ],
  "summary": {
    "totalPages": 25,
    "totalContent": 45000,
    "categories": ["Help", "Tutorials", "FAQ", "API Docs"]
  }
}
```

## Benefits of This Approach

1. **Intelligent Scraping**: AI adapts to different website structures
2. **Automatic Discovery**: Finds relevant content without manual configuration
3. **Structured Output**: Clean, organized data ready for analysis
4. **Scalable**: Easy to modify for different websites
5. **Respectful**: AI can implement polite scraping practices
6. **Comprehensive**: Captures metadata, content, and structure

This workflow leverages the power of AI with MCP tools to create a sophisticated, yet simple website parsing solution that can handle complex websites intelligently.
