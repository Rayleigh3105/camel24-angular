# Stage 1 - Building Angualar App
# Stage 2 - Setting up the Webserver

# Create image based on the official Node 8 image from dockerhub
FROM node:8.11.2-alpine as node

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install dependecies
RUN npm install

# Get all the code needed to run the application
COPY . .

RUN npm run build --prod -base-href http://modev.de:4200

# BUILD Angular app for production
EXPOSE 4200

# Stage 2 - Webserver
FROM nginx:1.13.12-alpine

#copy dist content to html nginx folder, config nginx to point in index.html
COPY --from=node /usr/src/app/dist/camel24-frontend /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
