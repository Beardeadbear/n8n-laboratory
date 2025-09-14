# Playwright MCP Website Parser Workflow

## Overview
This workflow uses Playwright MCP (Model Context Protocol) to intelligently parse websites, extract HTML content from each page, and save the processed content to Google Docs as separate articles. Playwright MCP provides superior web scraping capabilities compared to simple HTTP requests, including JavaScript rendering, dynamic content handling, and better content extraction.

## Architecture
```
Manual Trigger → Code (Website List) → Playwright MCP (Navigate & Extract) → Code (Content Processing) → Google Drive Create Doc → Success Confirmation
```

## Prerequisites
- n8n with MCP support enabled
- Playwright MCP server running
- Google Drive API credentials
- Target websites to parse

## Node-by-Node Breakdown

### Node 1: Manual Trigger
**Purpose**: Start the workflow manually
**Settings**:
- Trigger Type: Manual
- Description: "Start website parsing workflow"

### Node 2: Code (Website List)
**Purpose**: Define the list of websites and pages to parse
**Code**:
```javascript
// Define the websites and pages to parse
const websites = [
  {
    baseUrl: "https://community.fliplet.com",
    pages: [
      "/",
      "/help",
      "/tutorials", 
      "/faq",
      "/api-docs"
    ],
    category: "Fliplet Community",
    description: "Community documentation and help articles"
  }
  // Add more websites as needed
];

// Generate individual page objects
const pagesToProcess = [];
websites.forEach(site => {
  site.pages.forEach(page => {
    pagesToProcess.push({
      url: site.baseUrl + page,
      baseUrl: site.baseUrl,
      category: site.category,
      description: site.description,
      pagePath: page
    });
  });
});

return {
  json: {
    pages: pagesToProcess,
    totalPages: pagesToProcess.length
  }
};
```

### Node 3: Playwright MCP (Navigate & Extract)
**Purpose**: Use Playwright MCP to navigate to each page and extract HTML content
**Settings**:
- MCP Server: Playwright
- Action: Navigate and Extract Content
- URL: `{{ $json.url }}`
- Wait for: Network idle (2 seconds)
- Extract Selectors: 
  - Main content: `main, article, .content, .post-content`
  - Title: `h1, .title, .post-title`
  - Meta description: `meta[name="description"]`

**Advanced Settings**:
- JavaScript enabled: true
- Wait for selectors: `main, article, .content`
- Screenshot capture: true (for verification)
- Custom extraction script: true

**Custom Extraction Script**:
```javascript
async function extractContent(page) {
  // Wait for content to load
  await page.waitForSelector('main, article, .content, .post-content', { timeout: 10000 });
  
  // Extract main content
  const content = await page.evaluate(() => {
    // Try multiple selectors for main content
    const selectors = ['main', 'article', '.content', '.post-content', '.entry-content'];
    let mainContent = '';
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        mainContent = element.innerHTML;
        break;
      }
    }
    
    // Fallback to body if no main content found
    if (!mainContent) {
      mainContent = document.body.innerHTML;
    }
    
    // Extract title
    const title = document.querySelector('h1, .title, .post-title')?.textContent || 
                  document.title || 
                  'Untitled';
    
    // Extract meta description
    const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
    
    return {
      title: title.trim(),
      content: mainContent,
      metaDescription: metaDesc,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
  });
  
  return content;
}

// Execute extraction
const extractedData = await extractContent(page);
return extractedData;
```

### Node 4: Code (Content Processing)
**Purpose**: Clean and process the extracted HTML content
**Code**:
```javascript
const data = $input.first().json;
const html = data.content;
const title = data.title;
const url = data.url;
const category = data.category;

function cleanHtml(html) {
  // Remove script and style tags
  let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Convert line breaks and paragraphs
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
  cleaned = cleaned.replace(/<\/div>/gi, '\n');
  cleaned = cleaned.replace(/<\/h[1-6]>/gi, '\n\n');
  
  // Remove all HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&#39;/g, "'");
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  
  // Clean up whitespace
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.trim();
  
  return cleaned;
}

function extractStructuredContent(text) {
  // Split into logical sections
  const sections = text.split(/\n\n+/).filter(section => 
    section.trim().length > 50
  );
  
  // Create table of contents
  const toc = sections.map((section, index) => {
    const firstLine = section.split('\n')[0];
    return `${index + 1}. ${firstLine.substring(0, 100)}...`;
  }).join('\n');
  
  return {
    sections: sections,
    tableOfContents: toc,
    wordCount: text.split(/\s+/).length
  };
}

const cleanedContent = cleanHtml(html);
const structured = extractStructuredContent(cleanedContent);

return {
  json: {
    url: url,
    originalTitle: title,
    category: category,
    cleanContent: cleanedContent,
    sections: structured.sections,
    tableOfContents: structured.tableOfContents,
    wordCount: structured.wordCount,
    timestamp: new Date().toISOString()
  }
};
```

### Node 5: Google Drive Create Doc
**Purpose**: Create a Google Doc with the processed content
**Settings**:
- Operation: Create
- File Name: `{{ $json.originalTitle }} - {{ $json.category }}`
- Parents: [Your target folder ID]
- Content: Formatted document content

**Document Content**:
```
{{ $json.originalTitle }}

Source: {{ $json.url }}
Category: {{ $json.category }}
Extracted: {{ $json.timestamp }}
Word Count: {{ $json.wordCount }}

TABLE OF CONTENTS
{{ $json.tableOfContents }}

---

{{ $json.cleanContent }}
```

### Node 6: Success Confirmation
**Purpose**: Confirm successful document creation
**Settings**:
- Message: `Successfully created document: {{ $json.name }}`
- Include document link: `{{ $json.webViewLink }}`

## Advanced Features

### 1. Intelligent Page Discovery
```javascript
// Automatically discover pages by following links
async function discoverPages(baseUrl, maxDepth = 2) {
  const discoveredPages = new Set();
  const toVisit = [{ url: baseUrl, depth: 0 }];
  
  while (toVisit.length > 0) {
    const { url, depth } = toVisit.shift();
    
    if (depth > maxDepth || discoveredPages.has(url)) continue;
    
    discoveredPages.add(url);
    
    if (depth < maxDepth) {
      // Extract links from page
      const links = await extractLinks(url);
      links.forEach(link => {
        if (link.startsWith(baseUrl)) {
          toVisit.push({ url: link, depth: depth + 1 });
        }
      });
    }
  }
  
  return Array.from(discoveredPages);
}
```

### 2. Content Quality Filtering
```javascript
function filterQualityContent(content, minWords = 100) {
  // Remove low-quality content
  const sections = content.split('\n\n').filter(section => {
    const words = section.split(/\s+/).length;
    const hasMeaningfulContent = section.length > 50;
    const notJustLinks = !section.match(/^https?:\/\//);
    
    return words >= minWords && hasMeaningfulContent && notJustLinks;
  });
  
  return sections.join('\n\n');
}
```

### 3. Rate Limiting and Respectful Scraping
```javascript
// Add delays between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Process pages with delays
for (const page of pages) {
  await processPage(page);
  await delay(2000); // 2 second delay between pages
}
```

## Configuration Files

### Environment Variables
```bash
# Google Drive API
GOOGLE_DRIVE_CLIENT_ID=your_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret
GOOGLE_DRIVE_REDIRECT_URI=your_redirect_uri

# Playwright MCP
PLAYWRIGHT_MCP_SERVER_URL=http://localhost:3000
PLAYWRIGHT_MCP_API_KEY=your_api_key

# Target websites
TARGET_WEBSITES=community.fliplet.com,help.fliplet.com
```

### MCP Configuration
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    }
  }
}
```

## Usage Instructions

1. **Setup MCP Server**: Install and start the Playwright MCP server
2. **Configure Credentials**: Set up Google Drive API credentials
3. **Import Workflow**: Import the JSON workflow file
4. **Configure Target Websites**: Modify the website list in Node 2
5. **Run Workflow**: Execute manually or set up a schedule
6. **Monitor Progress**: Check the execution log for any errors

## Best Practices

1. **Respectful Scraping**: Add delays between requests
2. **Error Handling**: Implement retry logic for failed pages
3. **Content Validation**: Filter out low-quality or duplicate content
4. **Storage Management**: Organize documents by category and date
5. **Regular Updates**: Schedule periodic re-scraping for updated content

## Troubleshooting

### Common Issues
- **MCP Connection Failed**: Check if Playwright MCP server is running
- **Page Load Timeout**: Increase wait time or check page complexity
- **Content Extraction Failed**: Verify CSS selectors and page structure
- **Google Drive API Error**: Check credentials and permissions

### Debug Tips
- Enable Playwright debugging mode
- Use screenshots to verify page loading
- Check network requests in browser dev tools
- Test selectors manually before automation

## Performance Optimization

1. **Parallel Processing**: Process multiple pages simultaneously
2. **Caching**: Store extracted content to avoid re-scraping
3. **Incremental Updates**: Only process changed pages
4. **Resource Management**: Close browser tabs after extraction

This workflow provides a robust, scalable solution for website content extraction using the power of Playwright MCP combined with n8n's workflow automation capabilities.
