# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the Vue app
RUN npm run build

# Production stage - use nginx to serve static files
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (Cloud Run uses PORT env variable, default 8080)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
