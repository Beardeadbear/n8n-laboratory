# Quick Setup Guide: RAG Chatbot

## 🚀 Get Started in 5 Minutes

### 1. Import Workflows
1. **Open n8n** at `http://localhost:5678`
2. **Click "Import from File"** in the top right
3. **Import these files**:
   - `rag-chatbot-workflow.json` (Main chat interface)
   - `document-indexing-workflow.json` (Document processing)

### 2. Set Up Credentials

#### OpenAI API
1. **Go to Credentials** → **Add Credential**
2. **Select "OpenAI API"**
3. **Enter your API key** from [OpenAI Platform](https://platform.openai.com/api-keys)

#### Google Drive
1. **Go to Credentials** → **Add Credential**
2. **Select "Google Drive OAuth2"**
3. **Follow OAuth setup** (requires Google Cloud Console setup)

#### Qdrant
1. **Go to Credentials** → **Add Credential**
2. **Select "Qdrant"**
3. **Host**: `localhost`, **Port**: `6333`

### 3. Create Vector Database Collection

```bash
# Run this in your terminal
curl -X PUT "http://localhost:6333/collections/company_documents" \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": {
      "size": 1536,
      "distance": "Cosine"
    }
  }'
```

### 4. Test the Chat

1. **Activate the RAG Chatbot workflow**
2. **Go to `/chat`** in n8n
3. **Ask a question** about your documents

### 5. Add Documents

1. **Activate the Document Indexing workflow**
2. **Send a POST request** to `/document-update` with:
```json
{
  "fileId": "your_google_drive_file_id"
}
```

## 🔧 Troubleshooting

### Common Issues

**"Qdrant connection failed"**
- Check if Qdrant is running: `docker compose ps`
- Verify port 6333 is accessible

**"OpenAI API error"**
- Check your API key in credentials
- Verify you have credits in your OpenAI account

**"Google Drive permission denied"**
- Ensure OAuth2 is properly configured
- Check file sharing permissions

### Quick Commands

```bash
# Check if services are running
docker compose ps

# View logs
docker compose logs qdrant
docker compose logs n8n

# Restart everything
docker compose down
docker compose --profile cpu up -d
```

## 📚 Next Steps

1. **Add more documents** to Google Drive
2. **Customize the AI prompts** in Code nodes
3. **Set up automatic indexing** with Google Drive webhooks
4. **Integrate with Slack/Teams** for team chat

## 🎯 What You'll Have

✅ **Smart document search** using AI embeddings  
✅ **Context-aware responses** based on your documents  
✅ **Automatic document indexing** from Google Drive  
✅ **Professional chat interface** for employees  
✅ **Source citations** for all responses  

Your RAG chatbot is ready to help employees find information in company documents! 🚀














