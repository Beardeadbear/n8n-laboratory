# OpenAI RAG Chatbot Setup Guide

## 🎯 **What You're Building**
A Retrieval Augmented Generation (RAG) chatbot that automatically indexes company documents from Google Drive and answers employee questions using OpenAI's AI models.

## 🏗️ **Architecture Overview**
```
[Google Drive Triggers] → [Document Processing] → [OpenAI Embeddings] → [Pinecone Vector Store]
                                                                    ↓
[Chat Interface] → [Question Embedding] → [Vector Search] → [OpenAI Chat] → [Response]
```

## 📋 **Prerequisites**

### 1. **API Keys & Services**
- **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Pinecone Account**: Create free account at [Pinecone](https://www.pinecone.io/)
- **Google Drive API**: Set up OAuth2 credentials

### 2. **Required n8n Nodes**
- Google Drive (Triggers & Operations)
- OpenAI (Embeddings & Chat)
- Pinecone (Vector Database)
- Code (JavaScript processing)
- Chat Trigger & Respond to Webhook

## 🚀 **Step-by-Step Setup**

### **Step 1: Set Up Pinecone**
1. **Create Pinecone Account**
   - Go to [Pinecone Console](https://app.pinecone.io/)
   - Sign up for free tier
   - Create new project

2. **Create Index**
   - **Index Name**: `company-files`
   - **Dimensions**: `1536` (for OpenAI embeddings)
   - **Metric**: `cosine`
   - **Cloud**: Choose your region

3. **Get API Key**
   - Copy API key from dashboard
   - Note your environment (e.g., `us-east1-aws`)

### **Step 2: Configure Google Drive**
1. **Create Dedicated Folder**
   - Create folder: "Company Documents" in Google Drive
   - Note the folder ID from URL

2. **Set Up Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google Drive API
   - Create OAuth2 credentials

### **Step 3: Import Workflow**
1. **Open n8n** at `http://localhost:5678`
2. **Click "Import from File"**
3. **Import**: `rag-chatbot-openai-workflow.json`

### **Step 4: Configure Credentials**

#### **OpenAI API**
1. **Go to Credentials** → **Add Credential**
2. **Select "OpenAI API"**
3. **Enter your API key**

#### **Pinecone**
1. **Go to Credentials** → **Add Credential**
2. **Select "Pinecone"**
3. **Fill in**:
   - **API Key**: Your Pinecone API key
   - **Environment**: Your Pinecone environment (e.g., `us-east1-aws`)

#### **Google Drive**
1. **Go to Credentials** → **Add Credential**
2. **Select "Google Drive OAuth2"**
3. **Follow OAuth setup** with your Google Cloud credentials

### **Step 5: Configure Environment Variables**
Add to your `.env` file:
```bash
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
OPENAI_API_KEY=your_openai_key_here
```

### **Step 6: Update Workflow Settings**

#### **Google Drive Triggers**
1. **Click on "Google Drive File Created"**
2. **Update Folder ID**: `{{ $env.GOOGLE_DRIVE_FOLDER_ID }}`
3. **Repeat for "Google Drive File Updated"**

#### **Pinecone Vector Store**
1. **Click on "Pinecone Vector Store"**
2. **Update Collection Name**: `company-files`
3. **Repeat for "Pinecone Vector Store (Retrieval)"**

## 🔧 **Testing Your Setup**

### **Test Document Indexing**
1. **Upload a document** to your Google Drive folder
2. **Check n8n execution logs** for successful processing
3. **Verify in Pinecone** that vectors were created

### **Test Chat Interface**
1. **Activate the workflow**
2. **Go to `/chat`** in n8n
3. **Ask a question** about your documents

## 📊 **Workflow Breakdown**

### **Document Indexing Pipeline**
1. **Google Drive Triggers**: Watch for new/updated files
2. **Download File**: Get document content and metadata
3. **Data Loader**: Extract text content from various file types
4. **Text Splitter**: Create 1000-character chunks with 200-character overlap
5. **OpenAI Embeddings**: Convert chunks to 1536-dimensional vectors
6. **Pinecone Storage**: Store vectors with metadata

### **Chat Interface**
1. **Chat Trigger**: Receive user questions
2. **Question Embedding**: Convert question to vector
3. **Vector Search**: Find relevant document chunks
4. **Context Assembly**: Prepare context for AI
5. **OpenAI Chat**: Generate response using GPT-4
6. **Response Formatting**: Format with sources
7. **Webhook Response**: Send back to chat

## 🎨 **Customization Options**

### **AI Models**
- **Embeddings**: `text-embedding-ada-002` (1536 dimensions)
- **Chat**: `gpt-4` or `gpt-3.5-turbo`
- **Temperature**: 0.7 (balanced creativity/accuracy)

### **Document Processing**
- **Chunk Size**: 1000 characters
- **Overlap**: 200 characters
- **File Types**: PDF, Google Docs, text files

### **Vector Search**
- **Similarity Threshold**: 0.7
- **Result Limit**: 5 chunks
- **Distance Metric**: Cosine similarity

## 🔍 **Troubleshooting**

### **Common Issues**

**"Pinecone connection failed"**
- Check API key and environment
- Verify index name matches exactly
- Ensure index is ready (not building)

**"Google Drive permission denied"**
- Check OAuth2 setup
- Verify folder sharing permissions
- Ensure API is enabled

**"OpenAI API error"**
- Verify API key is correct
- Check account has credits
- Ensure model names are correct

### **Debug Commands**
```bash
# Check Pinecone index status
curl -X GET "https://controller.us-east1-aws.pinecone.io/databases/company-files" \
  -H "Api-Key: YOUR_API_KEY"

# Test OpenAI API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 📈 **Performance Optimization**

### **Vector Database**
- **Index Type**: Use `pod` for development, `serverless` for production
- **Replicas**: 1 for development, 2+ for production
- **Pod Type**: Choose based on your region and needs

### **Document Processing**
- **Batch Processing**: Process multiple documents simultaneously
- **Chunk Optimization**: Adjust chunk size based on document type
- **Metadata Filtering**: Add tags for better organization

## 🚀 **Next Steps**

1. **Add More Documents**: Upload company policies, handbooks, procedures
2. **Customize Prompts**: Modify system messages for your company's tone
3. **Add Memory**: Implement conversation history for better context
4. **Integrate with Slack/Teams**: Connect to team chat platforms
5. **Add Analytics**: Track usage patterns and response quality

## 🎯 **What You'll Achieve**

✅ **Automatic Document Indexing** from Google Drive  
✅ **Smart Vector Search** using OpenAI embeddings  
✅ **Context-Aware AI Responses** based on your documents  
✅ **Professional Chat Interface** for employees  
✅ **Source Citations** for all responses  
✅ **Scalable Architecture** for enterprise use  

Your OpenAI-powered RAG chatbot is ready to transform how employees access company information! 🚀














