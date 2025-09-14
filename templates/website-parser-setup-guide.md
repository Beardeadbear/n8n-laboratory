# Website Parser Setup Guide

## 🚀 Quick Setup in 5 Minutes

### 1. Import the Workflow
1. **Open n8n** at `http://localhost:5678`
2. **Click "Import from File"** in the top right
3. **Import**: `website-to-google-docs-workflow.json`

### 2. Set Up Google Drive Credentials
1. **Go to Credentials** → **Add Credential**
2. **Select "Google Drive OAuth2"**
3. **Follow OAuth setup** (requires Google Cloud Console setup)

### 3. Configure Your Target Websites
**Edit the "Website List" node** to add your target websites:

```javascript
const websites = [
  {
    url: "https://your-target-site.com",
    title: "Your Site Name",
    category: "Your Category"
  },
  {
    url: "https://another-site.com",
    title: "Another Site",
    category: "Another Category"
  }
];
```

### 4. Test the Workflow
1. **Click "Execute Workflow"** on the Manual Trigger node
2. **Monitor execution** through each node
3. **Check Google Drive** for created documents

## 🔧 Customization Options

### **Change Document Folder**
In the "Google Drive Create Doc" node:
- **Parents**: Add your Google Drive folder ID

### **Modify Content Processing**
Edit the "Content Processing" node to:
- Change document formatting
- Add custom metadata
- Modify article titles

### **Add Rate Limiting**
The workflow includes a 2-second delay between requests. Adjust in the "Rate Limit Delay" node.

## 📊 What You'll Get

Each Google Doc will contain:
- **Header**: Title, source URL, category, extraction date
- **Content**: Clean, extracted text from the webpage
- **Footer**: Metadata, word count, timestamp

## 🚨 Important Notes

- **Respect websites**: Don't overload servers
- **Check terms**: Ensure you have permission to scrape
- **Rate limiting**: Built-in delays to avoid blocking
- **Content quality**: Some sites may need manual review

## 🔍 Troubleshooting

**"HTTP Request failed"**
- Check if website is accessible
- Verify URL format
- Some sites may block automated requests

**"Google Drive permission denied"**
- Ensure OAuth2 is properly configured
- Check Google Drive permissions

**"Content extraction poor"**
- Some sites use JavaScript rendering
- May need to adjust extraction logic
- Consider using Puppeteer for complex sites

## 📈 Advanced Usage

### **Batch Processing**
- Add multiple websites to the list
- Workflow processes them sequentially
- Each creates a separate Google Doc

### **Scheduled Execution**
- Replace Manual Trigger with Cron Trigger
- Set up automatic website monitoring
- Example: Check for updates every 6 hours

### **Content Filtering**
- Modify the extraction logic
- Add content quality checks
- Filter out unwanted content

This workflow provides a solid foundation for website content extraction and can be customized based on your specific needs!













