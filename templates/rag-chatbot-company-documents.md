# RAG Chatbot for Company Documents using Google Drive and OpenAI

## Overview
This workflow implements a Retrieval Augmented Generation (RAG) chatbot that answers employee questions based on company documents stored in Google Drive. It automatically indexes new or updated documents in a vector database, allowing the chatbot to provide accurate and up-to-date information.

## Workflow Architecture

```
[Webhook Trigger] → [Google Drive] → [Document Processing] → [Vector Database] → [AI Chat Interface]
                                                                    ↓
[User Question] → [Vector Search] → [Context Assembly] → [OpenAI] → [Response]
```

## Prerequisites

### 1. API Keys & Credentials
- **OpenAI API Key**: For AI responses
- **Google Drive API**: For document access
- **Qdrant Vector Database**: For document storage (included in n8n starter kit)

### 2. Required n8n Nodes
- Google Drive
- OpenAI
- Qdrant
- Code (JavaScript)
- HTTP Request
- Webhook
- Chat Trigger
- Respond to Webhook

## Workflow Setup

### Workflow 1: Document Indexing Pipeline

#### Node 1: Webhook Trigger (Document Updates)
**Purpose**: Triggers when new documents are added/updated in Google Drive

**Settings**:
- **Node Name**: `Document Update Webhook`
- **HTTP Method**: POST
- **Path**: `/document-update`
- **Response Mode**: Respond to Webhook

**Output**: Receives webhook payload from Google Drive API

#### Node 2: Google Drive (Get File)
**Purpose**: Retrieves document content and metadata

**Settings**:
- **Operation**: Get
- **File ID**: `{{ $json.fileId }}`
- **Fields**: id, name, mimeType, modifiedTime, size

**Authentication**: Google Drive OAuth2

#### Node 3: Code (Document Processing)
**Purpose**: Processes document content and prepares for vector storage

**JavaScript Code**:
```javascript
const file = $input.first().json;
const content = file.content || '';

// Extract text content (handle different file types)
let processedContent = '';
if (file.mimeType.includes('text/') || file.mimeType.includes('application/')) {
  processedContent = content;
} else if (file.mimeType.includes('pdf') || file.mimeType.includes('document')) {
  // For PDFs and Google Docs, content should already be extracted
  processedContent = content;
}

// Create document chunks for vector storage
const chunks = [];
const chunkSize = 1000; // 1000 characters per chunk
const overlap = 200; // 200 character overlap

for (let i = 0; i < processedContent.length; i += chunkSize - overlap) {
  const chunk = processedContent.slice(i, i + chunkSize);
  if (chunk.trim().length > 50) { // Only add meaningful chunks
    chunks.push({
      content: chunk,
      metadata: {
        fileId: file.id,
        fileName: file.name,
        fileType: file.mimeType,
        modifiedTime: file.modifiedTime,
        chunkIndex: chunks.length
      }
    });
  }
}

return {
  json: {
    chunks: chunks,
    fileInfo: {
      id: file.id,
      name: file.name,
      type: file.mimeType,
      modified: file.modifiedTime
    }
  }
};
```

#### Node 4: OpenAI (Text Embedding)
**Purpose**: Converts document chunks to vector embeddings

**Settings**:
- **Operation**: Create Embedding
- **Model**: `text-embedding-ada-002`
- **Input**: `{{ $json.chunks.map(chunk => chunk.content).join('\n') }}`

**Authentication**: OpenAI API Key

#### Node 5: Qdrant (Store Vectors)
**Purpose**: Stores document embeddings in vector database

**Settings**:
- **Operation**: Upsert Points
- **Collection Name**: `company_documents`
- **Points**: 
```json
{
  "ids": "{{ $json.chunks.map((_, index) => $json.fileInfo.id + '_' + index) }}",
  "vectors": "{{ $json.embeddings }}",
  "payloads": "{{ $json.chunks.map(chunk => ({...chunk.metadata, content: chunk.content})) }}"
}
```

**Connection**: Qdrant instance (localhost:6333)

### Workflow 2: Chat Interface

#### Node 1: Chat Trigger
**Purpose**: Receives user questions in chat interface

**Settings**:
- **Node Name**: `Chat Trigger`
- **Chat Session ID**: (leave empty for new sessions)
- **Output Format**: 
```json
{
  "question": "user's question",
  "sessionId": "chat session identifier"
}
```

#### Node 2: OpenAI (Question Embedding)
**Purpose**: Converts user question to vector for similarity search

**Settings**:
- **Operation**: Create Embedding
- **Model**: `text-embedding-ada-002`
- **Input**: `{{ $json.question }}`

#### Node 3: Qdrant (Vector Search)
**Purpose**: Finds most relevant document chunks

**Settings**:
- **Operation**: Search
- **Collection Name**: `company_documents`
- **Vector**: `{{ $json.embeddings[0] }}`
- **Limit**: 5
- **Score Threshold**: 0.7

#### Node 4: Code (Context Assembly)
**Purpose**: Assembles relevant context for AI response

**JavaScript Code**:
```javascript
const question = $input.first().json.question;
const searchResults = $input.first().json.searchResults;

// Extract relevant document chunks
const relevantChunks = searchResults.map(result => ({
  content: result.payload.content,
  fileName: result.payload.fileName,
  score: result.score
}));

// Create context for AI
const context = relevantChunks
  .map(chunk => `Document: ${chunk.fileName}\nContent: ${chunk.content}\n---`)
  .join('\n');

// Create system prompt
const systemPrompt = `You are a helpful AI assistant for company employees. 
Answer questions based on the provided company documents. 
If the information is not in the documents, say so clearly.
Always cite the source document when possible.

Company Documents Context:
${context}

User Question: ${question}

Please provide a clear, helpful answer based on the documents above.`;

return {
  json: {
    systemPrompt: systemPrompt,
    userQuestion: question,
    relevantDocuments: relevantChunks.map(chunk => chunk.fileName)
  }
};
```

#### Node 5: OpenAI (Chat Completion)
**Purpose**: Generates AI response using context

**Settings**:
- **Operation**: Chat
- **Model**: `gpt-4` or `gpt-3.5-turbo`
- **Messages**: 
```json
[
  {
    "role": "system",
    "content": "{{ $json.systemPrompt }}"
  },
  {
    "role": "user", 
    "content": "{{ $json.userQuestion }}"
  }
]
```
- **Temperature**: 0.7
- **Max Tokens**: 1000

**Authentication**: OpenAI API Key

#### Node 6: Code (Response Formatting)
**Purpose**: Formats AI response for chat interface

**JavaScript Code**:
```javascript
const aiResponse = $input.first().json.choices[0].message.content;
const documents = $input.first().json.relevantDocuments;

// Format response for chat
const formattedResponse = `${aiResponse}

${documents.length > 0 ? `\n📚 Sources: ${documents.join(', ')}` : ''}`;

return {
  json: {
    response: formattedResponse,
    plainText: aiResponse,
    sources: documents
  }
};
```

#### Node 7: Respond to Webhook
**Purpose**: Sends response back to chat interface

**Settings**:
- **Respond With**: Text
- **Response Body**: `{{ $json.plainText }}`

## Workflow 3: Document Monitoring (Optional)

### Node 1: Cron Trigger
**Purpose**: Periodically checks for new/updated documents

**Settings**:
- **Rule**: `0 */6 * * *` (every 6 hours)
- **Output**: Triggers document indexing workflow

### Node 2: Google Drive (List Files)
**Purpose**: Lists all files in specified folder

**Settings**:
- **Operation**: List
- **Folder ID**: (your company documents folder ID)
- **Query**: `modifiedTime > '{{ $now.minus({hours: 6}).toISOString() }}'`

## Configuration Files

### Environment Variables (.env)
```bash
OPENAI_API_KEY=your_openai_api_key
GOOGLE_DRIVE_FOLDER_ID=your_company_docs_folder_id
QDRANT_HOST=localhost
QDRANT_PORT=6333
```

### Qdrant Collection Setup
```bash
# Create collection for company documents
curl -X PUT "http://localhost:6333/collections/company_documents" \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": {
      "size": 1536,
      "distance": "Cosine"
    }
  }'
```

## Usage Instructions

### 1. Initial Setup
1. **Configure Google Drive API** with proper permissions
2. **Set up Qdrant collection** for document storage
3. **Deploy both workflows** in n8n
4. **Test with sample documents**

### 2. Document Indexing
- **Automatic**: Webhook triggers on Google Drive changes
- **Manual**: Run indexing workflow manually
- **Scheduled**: Cron job runs every 6 hours

### 3. Chat Interface
- **Access**: n8n chat interface at `/chat`
- **Ask questions** about company documents
- **AI responds** with relevant information and sources

## Best Practices

### 1. Document Processing
- **Chunk size**: 1000 characters with 200 character overlap
- **File types**: Support PDF, Google Docs, text files
- **Metadata**: Include file name, type, modification date

### 2. Vector Search
- **Similarity threshold**: 0.7 for quality matches
- **Result limit**: 5 chunks for optimal context
- **Collection management**: Regular cleanup of outdated vectors

### 3. AI Responses
- **Context window**: Limit to relevant document chunks
- **Source citation**: Always mention source documents
- **Fallback handling**: Clear when information is unavailable

### 4. Security & Privacy
- **Access control**: Limit to authorized employees
- **Data retention**: Regular cleanup of old vectors
- **Audit logging**: Track document access and queries

## Troubleshooting

### Common Issues

1. **Google Drive API Limits**
   - Implement rate limiting
   - Use batch operations for large document sets

2. **Vector Database Performance**
   - Monitor collection size
   - Implement vector cleanup strategies

3. **AI Response Quality**
   - Adjust similarity thresholds
   - Improve context assembly logic

### Monitoring

- **n8n execution logs** for workflow status
- **Qdrant metrics** for vector database performance
- **OpenAI usage** for API cost monitoring

## Advanced Features

### 1. Multi-language Support
- Detect document language
- Use appropriate embedding models
- Provide responses in user's language

### 2. Document Versioning
- Track document changes over time
- Maintain version history in vectors
- Update responses based on latest versions

### 3. User Feedback Loop
- Collect response quality ratings
- Improve context selection based on feedback
- A/B test different AI models

### 4. Integration Options
- **Slack**: Direct integration for team chat
- **Microsoft Teams**: Enterprise chat platform
- **Email**: Automated document summaries
- **API**: REST endpoints for external systems

This RAG chatbot provides a powerful, scalable solution for company document management and employee support, with automatic indexing, intelligent search, and AI-powered responses.














