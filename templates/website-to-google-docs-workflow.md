# Website to Google Docs Parser Workflow

## 🎯 **What You're Building**
A workflow that automatically parses websites, extracts content from each page, and saves them as separate Google Docs articles. This is perfect for content aggregation, research, or creating knowledge bases from web sources.

## 🏗️ **Workflow Architecture**

```
[Manual Trigger] → [Website List] → [HTTP Request] → [Content Extraction] → [Content Processing] → [Google Docs Creation]
```

## 📋 **Prerequisites**

### 1. **API Keys & Services**
- **Google Drive API**: OAuth2 credentials for creating documents
- **Optional**: Proxy service for avoiding rate limits

### 2. **Required n8n Nodes**
- Manual Trigger
- Code (JavaScript)
- HTTP Request
- Google Drive
- Set (Data manipulation)
- Split In Batches (for multiple websites)

## 🚀 **Workflow Setup**

### **Node 1: Manual Trigger**
**Purpose**: Starts the workflow manually

**Settings**:
- **Node Name**: `Start Workflow`
- **Trigger Type**: Manual
- **Output**: Empty (will be populated by next node)

### **Node 2: Code (Website List)**
**Purpose**: Defines the list of websites to parse

**JavaScript Code**:
```javascript
// List of websites to parse
const websites = [
  {
    url: "https://example.com",
    title: "Example Website",
    category: "Technology"
  },
  {
    url: "https://another-site.com",
    title: "Another Site",
    category: "Business"
  },
  // Add more websites as needed
];

// You can also load from external source
// const websites = await fetch('https://api.example.com/websites').then(r => r.json());

return websites.map(site => ({ json: site }));
```

### **Node 3: HTTP Request (Fetch Webpage)**
**Purpose**: Downloads the HTML content of each website

**Settings**:
- **Operation**: GET
- **URL**: `={{ $json.url }}`
- **Options**:
  - **Timeout**: 30000 (30 seconds)
  - **Headers**: 
    ```json
    {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    ```

### **Node 4: Code (Content Extraction)**
**Purpose**: Extracts clean text content from HTML

**JavaScript Code**:
```javascript
const html = $input.first().json.data;
const url = $input.first().json.url;
const title = $input.first().json.title;
const category = $input.first().json.category;

// Basic HTML tag removal and text extraction
function extractText(html) {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags but keep line breaks
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<\/h[1-6]>/gi, '\n\n');
  
  // Remove all remaining HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, ' ');
  
  // Clean up whitespace
  text = text.replace(/\n\s*\n/g, '\n\n');
  text = text.replace(/\s+/g, ' ');
  text = text.trim();
  
  return text;
}

// Extract title from HTML if available
function extractTitle(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : title;
}

// Extract main content (basic approach)
function extractMainContent(html) {
  // Try to find main content area
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return extractText(mainMatch[1]);
  
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) return extractText(articleMatch[1]);
  
  const contentMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (contentMatch) return extractText(contentMatch[1]);
  
  // Fallback: extract from body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return extractText(bodyMatch[1]);
  
  // Last resort: extract from entire HTML
  return extractText(html);
}

const extractedTitle = extractTitle(html);
const mainContent = extractMainContent(html);

// Split content into sections (optional)
const sections = mainContent.split(/\n\n+/).filter(section => 
  section.trim().length > 50
);

return {
  json: {
    url: url,
    originalTitle: title,
    extractedTitle: extractedTitle,
    category: category,
    content: mainContent,
    sections: sections,
    wordCount: mainContent.split(/\s+/).length,
    timestamp: new Date().toISOString()
  }
};
```

### **Node 5: Code (Content Processing & Enhancement)**
**Purpose**: Processes and enhances the extracted content

**JavaScript Code**:
```javascript
const data = $input.first().json;
const content = data.content;
const title = data.extractedTitle;
const category = data.category;

// Clean and structure content
function processContent(text) {
  // Remove excessive whitespace
  let processed = text.replace(/\n{3,}/g, '\n\n');
  
  // Add structure markers
  processed = `# ${title}\n\n`;
  processed += `**Source**: ${data.url}\n`;
  processed += `**Category**: ${category}\n`;
  processed += `**Extracted**: ${new Date().toLocaleDateString()}\n\n`;
  processed += `---\n\n`;
  
  // Add content
  processed += text;
  
  // Add footer
  processed += `\n\n---\n\n`;
  processed += `*This content was automatically extracted from ${data.url}*\n`;
  processed += `*Word count: ${data.wordCount}*\n`;
  processed += `*Extraction timestamp: ${data.timestamp}*`;
  
  return processed;
}

// Create article title for Google Docs
function createArticleTitle(title, category) {
  const cleanTitle = title.replace(/[^\w\s-]/g, '').trim();
  const timestamp = new Date().toISOString().split('T')[0];
  return `${category} - ${cleanTitle} (${timestamp})`;
}

const processedContent = processContent(content);
const articleTitle = createArticleTitle(title, category);

return {
  json: {
    ...data,
    processedContent: processedContent,
    articleTitle: articleTitle,
    readyForGoogleDocs: true
  }
};
```

### **Node 6: Google Drive (Create Document)**
**Purpose**: Creates a new Google Doc with the extracted content

**Settings**:
- **Operation**: Create
- **File Type**: Google Docs
- **Name**: `={{ $json.articleTitle }}`
- **Content**: `={{ $json.processedContent }}`
- **Parents**: (optional) Specify folder ID where to save

**Authentication**: Google Drive OAuth2

### **Node 7: Set (Success Confirmation)**
**Purpose**: Confirms successful document creation

**Settings**:
- **Keep Only Set**: true
- **Fields to Set**:
  - **status**: `success`
  - **googleDocId**: `={{ $json.id }}`
  - **googleDocUrl**: `={{ $json.webViewLink }}`
  - **message**: `Article "${$json.articleTitle}" created successfully`

## 🔧 **Advanced Features**

### **Rate Limiting & Delays**
Add a **"Wait"** node between HTTP requests to avoid being blocked:

**Settings**:
- **Amount**: 2
- **Unit**: Seconds

### **Error Handling**
Add **"Error Trigger"** nodes to handle failed requests:

**Settings**:
- **Error Message**: Custom error handling
- **Retry Logic**: Implement retry mechanism

### **Content Filtering**
Enhance the content extraction with filters:

```javascript
// Add to Node 4 (Content Extraction)
function filterContent(text) {
  // Remove common web elements
  const filters = [
    /cookie|privacy|terms|advertisement/gi,
    /subscribe|newsletter|sign up/gi,
    /social media|follow us/gi
  ];
  
  filters.forEach(filter => {
    text = text.replace(filter, '');
  });
  
  return text;
}
```

### **Multiple Page Scraping**
For websites with multiple pages:

```javascript
// Add to Node 2 (Website List)
const websites = [
  {
    baseUrl: "https://example.com",
    pages: ["/page1", "/page2", "/page3"],
    title: "Example Site"
  }
];

const allUrls = [];
websites.forEach(site => {
  site.pages.forEach(page => {
    allUrls.push({
      url: site.baseUrl + page,
      title: `${site.title} - ${page}`,
      category: site.category
    });
  });
});

return allUrls.map(url => ({ json: url }));
```

## 📁 **Output Structure**

Each created Google Doc will contain:

1. **Header**: Title, source URL, category, extraction date
2. **Content**: Clean, extracted text from the webpage
3. **Footer**: Metadata, word count, timestamp
4. **Formatting**: Markdown-style structure for easy reading

## 🚨 **Important Considerations**

### **Legal & Ethical**
- Always respect robots.txt files
- Check website terms of service
- Implement reasonable delays between requests
- Don't overload servers

### **Technical Limitations**
- Some websites use JavaScript rendering (may need Puppeteer)
- Anti-bot measures may block requests
- Content structure varies significantly between sites

### **Rate Limiting**
- Implement delays between requests (2-5 seconds)
- Use proxy rotation if needed
- Monitor for IP blocking

## 🔄 **Workflow Execution**

1. **Manual Trigger**: Start the workflow
2. **Website Processing**: Each website is processed sequentially
3. **Content Extraction**: HTML is parsed and cleaned
4. **Document Creation**: Google Docs are created automatically
5. **Confirmation**: Success/failure status is reported

## 📊 **Monitoring & Logging**

Add logging nodes to track:
- Successfully processed websites
- Failed requests
- Content quality metrics
- Google Docs creation status

This workflow provides a robust foundation for website content extraction and can be customized based on your specific needs and target websites.













