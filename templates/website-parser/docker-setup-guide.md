# Docker Setup Guide for Playwright MCP Server

## 🐳 **Running Playwright MCP Server in Docker**

This guide shows you how to run the Microsoft Playwright MCP server in Docker containers, which is often easier than local installation.

## **Quick Start (Choose One Method)**

### **Method 1: Simple Docker Run (Recommended)**
```bash
# For Linux/Mac
./docker-run.sh

# For Windows
docker-run.bat
```

### **Method 2: Docker Compose**
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d playwright-mcp

# View logs
docker-compose logs -f playwright-mcp
```

### **Method 3: Manual Docker Commands**
```bash
# Pull the image
docker pull mcr.microsoft.com/playwright/mcp:latest

# Run the container
docker run -d \
  --name playwright-mcp-server \
  -p 3000:3000 \
  --restart unless-stopped \
  mcr.microsoft.com/playwright/mcp:latest \
  --caps=vision,pdf,verify
```

## **Available Docker Images**

### **Official Microsoft Image**
```bash
mcr.microsoft.com/playwright/mcp:latest
```

### **Alternative Images**
```bash
# If the official image doesn't work
ghcr.io/microsoft/playwright-mcp:latest
playwright/mcp:latest
```

## **Configuration Options**

### **Basic Configuration**
```bash
docker run -d \
  --name playwright-mcp-server \
  -p 3000:3000 \
  mcr.microsoft.com/playwright/mcp:latest
```

### **With Additional Capabilities**
```bash
docker run -d \
  --name playwright-mcp-server \
  -p 3000:3000 \
  mcr.microsoft.com/playwright/mcp:latest \
  --caps=vision,pdf,verify
```

### **With Specific Browser**
```bash
docker run -d \
  --name playwright-mcp-chromium \
  -p 3001:3000 \
  mcr.microsoft.com/playwright/mcp:latest \
  --browser=chromium \
  --caps=vision,pdf,verify
```

### **With Debug Mode**
```bash
docker run -d \
  --name playwright-mcp-debug \
  -p 3002:3000 \
  mcr.microsoft.com/playwright/mcp:latest \
  --headless=false \
  --caps=vision,pdf,verify
```

## **Docker Compose Services**

The `docker-compose.yml` file includes three different configurations:

### **1. Main Service (Port 3000)**
- Production-ready configuration
- All capabilities enabled
- Automatic restart

### **2. Chromium Service (Port 3001)**
- Uses Chromium browser specifically
- Good for compatibility testing

### **3. Debug Service (Port 3002)**
- Non-headless mode for debugging
- Development environment
- Verbose logging

## **Management Commands**

### **Start Services**
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d playwright-mcp
```

### **Stop Services**
```bash
# Stop all services
docker-compose down

# Stop specific service
docker-compose stop playwright-mcp
```

### **View Logs**
```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f playwright-mcp

# Or use Docker directly
docker logs playwright-mcp-server
```

### **Restart Services**
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart playwright-mcp
```

## **Troubleshooting**

### **Port Already in Use**
```bash
# Check what's using port 3000
netstat -tulpn | grep :3000

# Use a different port
docker run -d \
  --name playwright-mcp-server \
  -p 3001:3000 \
  mcr.microsoft.com/playwright/mcp:latest
```

### **Container Won't Start**
```bash
# Check container logs
docker logs playwright-mcp-server

# Check container status
docker ps -a

# Remove and recreate
docker rm -f playwright-mcp-server
docker run -d --name playwright-mcp-server -p 3000:3000 mcr.microsoft.com/playwright/mcp:latest
```

### **Permission Issues**
```bash
# On Linux/Mac, you might need sudo
sudo docker run -d --name playwright-mcp-server -p 3000:3000 mcr.microsoft.com/playwright/mcp:latest

# Or add your user to the docker group
sudo usermod -aG docker $USER
```

## **Integration with n8n**

### **MCP Client Configuration**
Once the Docker container is running, configure your n8n MCP Client node:

- **Endpoint**: `http://localhost:3000/mcp`
- **Server Transport**: `Server Sent Events (Deprecated)`
- **Authentication**: `None`
- **Tools to Include**: `All`

### **Test Connection**
1. Start the Docker container
2. In n8n, open the MCP Client node
3. Click "Execute step" to test the connection
4. You should see available Playwright MCP tools listed

## **Production Deployment**

### **Environment Variables**
```bash
docker run -d \
  --name playwright-mcp-server \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DEBUG=false \
  mcr.microsoft.com/playwright/mcp:latest
```

### **Resource Limits**
```bash
docker run -d \
  --name playwright-mcp-server \
  -p 3000:3000 \
  --memory=2g \
  --cpus=1 \
  mcr.microsoft.com/playwright/mcp:latest
```

### **Health Checks**
```bash
docker run -d \
  --name playwright-mcp-server \
  -p 3000:3000 \
  --health-cmd="curl -f http://localhost:3000/mcp || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  mcr.microsoft.com/playwright/mcp:latest
```

## **Monitoring and Logs**

### **Container Status**
```bash
# Check running containers
docker ps

# Check all containers (including stopped)
docker ps -a

# Check resource usage
docker stats playwright-mcp-server
```

### **Log Analysis**
```bash
# Follow logs in real-time
docker logs -f playwright-mcp-server

# Show last 100 lines
docker logs --tail 100 playwright-mcp-server

# Show logs since specific time
docker logs --since "2024-01-15T10:00:00" playwright-mcp-server
```

## **Cleanup**

### **Stop and Remove**
```bash
# Stop the container
docker stop playwright-mcp-server

# Remove the container
docker rm playwright-mcp-server

# Remove the image (optional)
docker rmi mcr.microsoft.com/playwright/mcp:latest
```

### **Docker Compose Cleanup**
```bash
# Stop and remove all services
docker-compose down

# Remove volumes (if any)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## **Benefits of Docker Approach**

✅ **Easy Setup**: No need to install Node.js, npm, or Playwright locally  
✅ **Consistent Environment**: Same setup across different machines  
✅ **Isolation**: Doesn't interfere with your local development environment  
✅ **Easy Updates**: Just pull the latest image  
✅ **Portability**: Works the same on Windows, Mac, and Linux  
✅ **Resource Management**: Easy to control memory and CPU usage  

## **Next Steps**

1. **Choose your preferred method** (Docker run, Docker Compose, or manual)
2. **Start the container** using the commands above
3. **Test the connection** in n8n using the MCP Client node
4. **Run your workflow** to start parsing websites!

The Docker approach makes it much easier to get the Playwright MCP server running without worrying about local dependencies or conflicts.
