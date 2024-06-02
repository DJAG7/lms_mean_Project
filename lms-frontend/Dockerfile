# Use a Node.js image as the Build Stage
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY ./package*.json ./

# Installation of all dependencies
RUN npm install --force
RUN npm install -g @angular/cli 

# Copy the bash script to the Docker image
COPY modify_quill_editor.sh ./

# Execute the bash script to modify the quill-editor.component.d.ts file
RUN chmod +x modify_quill_editor.sh && ./modify_quill_editor.sh

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