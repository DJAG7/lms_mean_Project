

# Backend Setup

## Cloning the Repository into local system

## Important Configuration required in backend for excutation

- In Backend need to setup secrets
    - backend-secret.yaml file need to add the below credentials
```yaml

    PORT: <YOUR_CONTAINER_PORT_NUMBER>
    JWT_TOKEN_SECRET: <YOUR_JWT_TOKEN>
    AWS_REGION: <YOUR_AWS_REGION>
    AWS_ACCESS_KEY_ID: <YOUR_AWS_ACCESS_KEY_ID>
    AWS_SECRET_ACCESS_KEY: <YOUR_AWS_SECRET_ACCESS_KEY>
    AWS_BUCKET_NAME: <YOUR_AWS_S3_BUCKET_NAME>
    GITHUB_CLIENT_ID: <YOUR_GIT_CLIENT_ID>
    GITHUB_CLIENT_SECRET: <YOUR_GIT_CLIENT_SECRET>

```

    - deployment.yaml file need to add below points
```yaml

    name: MONGO_URL
    value: "mongodb+srv://<USERNAME>:<PASSWORD>@sparrow.hcgs1ob.mongodb.net/<database>"
    name: COMPILER_URL
    value: "YOUR_COMPILER_URL"


-- After add the above in the necessary files start the below process:

## Install Dependencies

    command: npm install

## Configure Environment Variables

-Create a .env file in the root with the following variables:

    - PORT=3001
    - Mongo_URL=mongodb+srv://{username}:{password}@ankurcluster.h2znnvu.mongodb.net/{database}
    - GITHUB_CLIENT_SECRET=clientpassword

## Run Server

    command: node server.js


- Access the backend on http://localhost:3001.

![alt text](./screenshots/image-1.png)


## Docker Setup for Backend

```Dockerfile

FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]

```



## Build and Push Docker Image

    command: docker build -t lms-backend:latest .
    command: docker tag lms-backend:latest ankuronlyme/capstone_backend:v1
    command: docker push ankuronlyme/capstone_backend:v1

![alt text](./screenshots/image-2.png)


## Run Docker Container

    command: docker run -dp 3001:3001 \-e "PORT=3001" \-e "MONGO_URL=mongodb+srv://TravelMemory:Travel@ankurcluster.h2znnvu.mongodb.net/Travel" \-e "GITHUB_CLIENT_SECRET=clientpassword" \ankuronlyme/capstone_backend:v1

![alt text](./screenshots/image-3.png)



# Frontend Setup

## Cloning the Repository into local system

## Install Angular CLI

    command: npm install -g @angular/cli

## Install Dependencies and Start Development Server

    command: npm install --force
             source ./modify_quill_editor.sh
             npm start

## Build Angular Application

    command: ng build --prod

 - Check the build output in the dist directory.

## Docker Setup for Frontend

```Dockerfile

# Use a Node.js image as the Build Stage
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./

# Installation of all dependencies
RUN npm install --force
RUN npm install -g @angular/cli

# Install dos2unix to convert line endings
RUN apt-get update && apt-get install -y dos2unix

# Copy the script into the Docker image
COPY modify_quill_editor.sh .

# Convert line endings to Unix format to remove carriage return characters
RUN dos2unix modify_quill_editor.sh

# Make the script executable
RUN chmod +x modify_quill_editor.sh

# Execute the script
RUN ./modify_quill_editor.sh

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build --prod

# Use a lightweight web server to serve the frontend and deployment Process
FROM nginx:alpine

COPY --from=build /app/dist/lms-front-ang /usr/share/nginx/html

# Expose the port on which the frontend will run
EXPOSE 80

# Start the web server
CMD [ "nginx", "-g", "daemon off;" ]

```

    
## Build and Push Docker Image

    command: docker build -t lms-frontend:latest .
             docker tag lms-frontend:latest ankuronlyme/capstone_frontend:v1
             docker push ankuronlyme/capstone_frontend:v1

![alt text](./screenshots/image-4.png)

## Run Docker Container

    command: docker run -dp 4200:80 ankuronlyme/capstone_frontend:v1















