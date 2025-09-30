# --- Stage 1: Build the TypeScript application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies, including dev dependencies for the build
RUN npm install

# Copy the rest of the source code
COPY . .

# Compile the TypeScript code into JavaScript
RUN npm run build

# --- Stage 2: Create the minimal production image ---
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy production dependencies only
COPY --from=builder /app/package*.json ./
# Install only production dependencies
RUN npm install --omit=dev

# Copy the compiled JavaScript code
COPY --from=builder /app/dist ./dist

# Copy other necessary files (e.g., package.json for npm start)
COPY --from=builder /app/package.json ./

# Expose the port the server runs on
EXPOSE 3001

# The command to start the application
CMD ["npm", "start"]
