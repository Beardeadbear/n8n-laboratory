# Playwright MCP Article Discovery Setup Guide

## What This Workflow Does

This workflow automatically:
1. **Opens the Fliplet community website** using Playwright MCP
2. **Discovers article pages** by scanning for links that look like articles
3. **Extracts HTML content** from each discovered page
4. **Cleans and processes** the content (removes HTML, formats text)
5. **Creates Google Docs** for each article and saves them to Google Drive

## Prerequisites

### 1. Install Playwright MCP Server
```bash
npm install -g @modelcontextprotocol/server-playwright
```

### 2. Start Playwright MCP Server
```bash
npx @modelcontextprotocol/server-playwright
```

### 3. Google Drive API Setup
- Create a Google Cloud Project
- Enable Google Drive API
- Create OAuth2 credentials
- Get your Google Drive folder ID where documents will be saved

## Quick Setup Steps

### Step 1: Import the Workflow
1. Open n8n
2. Click "Import from file"
3. Select `playwright-article-discovery-workflow.json`

### Step 2: Configure Google Drive
1. In the "Google Drive: Create Doc" node, replace the `parents` field with your folder ID
2. Set up Google Drive credentials in n8n

### Step 3: Configure Target Website
1. In "Code: Website Config" node, modify the `baseUrl` if needed
2. Adjust the `startPages` array to include the pages you want to start discovery from

### Step 4: Test the Workflow
1. Click "Execute Workflow"
2. Check the execution log for any errors
3. Verify that documents are created in your Google Drive folder

## How It Works

### Node 1: Manual Trigger
- Starts the workflow manually

### Node 2: Website Config
- Defines the base URL and starting pages
- Sets limits to prevent infinite crawling

### Node 3: Playwright Navigate
- Uses Playwright MCP to open the first page
- Waits for the page to fully load

### Node 4: Extract Article Links
- Scans the page for links that look like articles
- Looks for URLs containing patterns like `/help/`, `/tutorials/`, `/article/`, etc.
- Extracts current page information

### Node 5: Get Article Content
- Navigates to each discovered article page
- Extracts the main content using multiple CSS selectors
- Captures title, content, author, and publish date

### Node 6: Process Content
- Cleans HTML tags and formatting
- Creates structured content with table of contents
- Generates clean filenames

### Node 7: Create Google Doc
- Creates a new Google Doc for each article
- Includes metadata and formatted content
- Saves to your specified Google Drive folder

### Node 8: Success Notification
- Confirms successful document creation
- Shows document link and article details

## Customization Options

### Change Target Website
Modify the `baseUrl` in "Code: Website Config":
```javascript
const baseUrl = "https://your-website.com";
```

### Adjust Article Detection
Modify the link detection patterns in "Code: Extract Article Links":
```javascript
if (href.includes('/help/') || 
    href.includes('/tutorials/') || 
    href.includes('/your-pattern/')) {
  // Add your custom patterns here
}
```

### Modify Content Extraction
Adjust the CSS selectors in "Code: Extract Article Content":
```javascript
const selectors = [
  'main', 
  'article', 
  '.content',
  '.your-custom-class'  // Add your selectors
];
```

### Change Document Format
Modify the document content template in "Google Drive: Create Doc":
```
{{ $json.originalTitle }}

Your custom header here...
{{ $json.cleanContent }}
```

## Troubleshooting

### Playwright MCP Connection Issues
- Ensure the Playwright MCP server is running
- Check if the server is accessible from n8n
- Verify the server configuration

### Google Drive API Errors
- Check your OAuth2 credentials
- Verify the folder ID is correct
- Ensure the Google Drive API is enabled

### Content Extraction Issues
- Check the CSS selectors in the extraction nodes
- Verify the website structure hasn't changed
- Use browser dev tools to test selectors manually

### Rate Limiting
- Add delays between requests if needed
- Respect the website's robots.txt
- Consider implementing polite crawling practices

## Advanced Features

### Batch Processing
To process multiple articles at once, you can modify the workflow to:
- Use a "Split In Batches" node
- Process articles in parallel (with rate limiting)
- Add error handling and retry logic

### Content Filtering
Add quality filters to only process articles that meet certain criteria:
- Minimum word count
- Specific content types
- Date ranges
- Author preferences

### Incremental Updates
Implement logic to only process new or updated articles:
- Store processed URLs in a database
- Check last modified dates
- Skip already processed content

## Performance Tips

1. **Set reasonable limits** to prevent overwhelming the target website
2. **Add delays** between requests (2-5 seconds recommended)
3. **Use headless mode** for faster processing
4. **Implement caching** to avoid re-processing the same content
5. **Monitor resource usage** and adjust batch sizes accordingly

This workflow provides a powerful, automated solution for discovering and archiving web content using the latest Playwright MCP technology.
