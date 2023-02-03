FROM node:alpine

# Working Dir
WORKDIR /app

# Copy package json files
COPY package.json .

# Install dependencies
RUN npm install --only=prod

# Copy Source files
COPY . .

# RUN
CMD ["npm", "start"]