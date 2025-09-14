// Test script to verify Playwright MCP can access Fliplet community website
// Run this with: node test-playwright-access.js

const { chromium } = require('playwright');

async function testFlipletAccess() {
  console.log('🚀 Starting Playwright test...');
  
  const browser = await chromium.launch({ 
    headless: false, // Set to true for production
    slowMo: 1000 // Slow down for visibility
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('📱 Opening Fliplet community website...');
    await page.goto('https://community.fliplet.com/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully!');
    console.log('📄 Page title:', await page.title());
    
    // Wait a bit for content to load
    await page.waitForTimeout(2000);
    
    // Look for article links
    console.log('🔍 Scanning for article links...');
    const articleLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'));
      const articleUrls = new Set();
      
      links.forEach(link => {
        const href = link.href;
        if (href.includes('community.fliplet.com') && 
            (href.includes('/help/') || 
             href.includes('/tutorials/') || 
             href.includes('/faq/') || 
             href.includes('/api-docs/') ||
             href.includes('/article/') ||
             href.includes('/post/') ||
             href.includes('/guide/') ||
             href.includes('/docs/')) &&
            !href.includes('#') &&
            !href.includes('?') &&
            href !== 'https://community.fliplet.com/' &&
            href !== 'https://community.fliplet.com') {
          articleUrls.add(href);
        }
      });
      
      return Array.from(articleUrls);
    });
    
    console.log(`📚 Found ${articleLinks.length} potential article links:`);
    articleLinks.slice(0, 10).forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
    
    if (articleLinks.length > 0) {
      console.log('\n🧪 Testing first article link...');
      const firstArticleUrl = articleLinks[0];
      
      await page.goto(firstArticleUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      console.log('✅ Article page loaded!');
      console.log('📄 Article title:', await page.title());
      
      // Try to extract content
      const content = await page.evaluate(() => {
        const selectors = ['main', 'article', '.content', '.post-content', '.entry-content'];
        let mainContent = '';
        
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            mainContent = element.textContent;
            break;
          }
        }
        
        if (!mainContent) {
          mainContent = document.body.textContent;
        }
        
        return {
          title: document.title,
          content: mainContent.substring(0, 500) + '...',
          wordCount: mainContent.split(/\s+/).length
        };
      });
      
      console.log('📝 Content extracted successfully:');
      console.log('   Title:', content.title);
      console.log('   Word count:', content.wordCount);
      console.log('   Preview:', content.content);
    }
    
    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'fliplet-community-test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved as fliplet-community-test.png');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

// Run the test
testFlipletAccess().catch(console.error);
