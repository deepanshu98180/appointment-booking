# Use official Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# RUN npm install -g nodemon

# Copy rest of the source files
COPY . .

# Expose the app port
EXPOSE 2408

# Start the app with nodemon
CMD ["npx", "nodemon", "src/server.js"]
