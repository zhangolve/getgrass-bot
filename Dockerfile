# Use a Node.js base image (choose a version that matches your project)
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app listens on (e.g., 3000)
# EXPOSE 3000

# Define the command to run your app
# CMD ["npm", "start"]
