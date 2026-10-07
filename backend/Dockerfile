FROM node:20-bookworm-slim

# Install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

# Bundle app source
COPY . .

# Expose port
EXPOSE 5000

# Start command
CMD [ "npm", "start" ]

