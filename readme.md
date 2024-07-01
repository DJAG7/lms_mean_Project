

#Backend Setup

-Clone Repository: Clone the development branch from Prashant's repository.

-Install Dependencies

npm install

-Configure Environment Variables

Create a .env file in the root with the following variables:

PORT=3001
Mongo_URL=mongodb+srv://TravelMemory:Travel@ankurcluster.h2znnvu.mongodb.net/Travel
GITHUB_CLIENT_SECRET=clientpassword

-Run Server

node server.js


Access the backend on http://localhost:3001.

![alt text](./screenshots/image-1.png)


-Docker Setup for Backend

FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]


-Build and Push Docker Image

docker build -t lms-backend:latest .
docker tag lms-backend:latest ankuronlyme/capstone_backend:v1
docker push ankuronlyme/capstone_backend:v1

![alt text](./screenshots/image-2.png)


-Run Docker Container

docker run -dp 3001:3001 \
  -e "PORT=3001" \
  -e "MONGO_URL=mongodb+srv://TravelMemory:Travel@ankurcluster.h2znnvu.mongodb.net/Travel" \
  -e "GITHUB_CLIENT_SECRET=clientpassword" \
  ankuronlyme/capstone_backend:v1

![alt text](./screenshots/image-3.png)







