# Stage 1: Build the React application
# We use Node.js 18 on Alpine Linux to install npm dependencies and compile static files
FROM node:18-alpine as build-stage

# Create and switch to the working directory inside the builder container
WORKDIR /app

# Copy dependency files first so Docker reuses cached layers when packages are unchanged
COPY package*.json ./
# Install npm dependencies needed for building the frontend
RUN npm install

# Copy all the frontend source code into the builder container
COPY . .
# Run Vite build to compile React JSX and CSS into production static assets in /app/dist
RUN npm run build

# Stage 2: Serve the compiled static assets using Nginx
# We switch to an ultra-lightweight Nginx Alpine image (~25MB) so we don't ship Node.js in production
FROM nginx:stable-alpine as production-stage

# Copy only the compiled HTML, CSS, and JS from the build stage into Nginx's web root
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy our custom Nginx config so client-side React Router paths fallback to index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Inform Docker that Nginx listens for HTTP traffic on standard port 80
EXPOSE 80

# Run Nginx in the foreground so the container stays running
CMD ["nginx", "-g", "daemon off;"]
