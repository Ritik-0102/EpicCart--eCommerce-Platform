# Start from a lightweight official Node.js 20 image based on Debian Bookworm
FROM node:20-bookworm-slim

# Install OpenSSL because Prisma's database engine requires it to talk to PostgreSQL securely
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy dependency files first so Docker can cache npm install if packages have not changed
COPY package*.json ./
# Copy the Prisma schema so we can generate the database client during the build
COPY prisma ./prisma/

# Install the Node packages listed in package.json
RUN npm install
# Generate the Prisma Client tailored to this Linux container
RUN npx prisma generate

# Copy the rest of the backend source code into the container
COPY . .

# Tell Docker that the backend server listens on port 5000 inside the container
EXPOSE 5000

# Start the Express server using npm start (which runs node server.js)
CMD [ "npm", "start" ]
