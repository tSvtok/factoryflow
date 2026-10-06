FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 3000

# Start application in development mode with nodemon
CMD ["npm", "run", "dev"]
