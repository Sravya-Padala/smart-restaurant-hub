# Use an official Node.js 18 image as the base
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install all production dependencies
RUN npm install --omit=dev

# Copy the rest of your server-side code
COPY . .

# Expose the port your app runs on
EXPOSE 3001

# The command to run your application
CMD [ "node", "index.js" ]