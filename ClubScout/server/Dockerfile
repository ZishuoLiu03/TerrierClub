# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (Google Cloud Run expects 8080 usually, but we use 3000 default)
EXPOSE 3000

# Start server
CMD ["npm", "start"]
