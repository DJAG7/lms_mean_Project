# Sparrow Coding Labs

Create a `.env` file with these parameters, remember to change the values.

```
PORT=3000
MONGO_URL="mongodb+srv://username:password@cluster0.bswpr.mongodb.net/sparrowdb?retryWrites=true&w=majority"
JWT_TOKEN_SECRET="tokenvalue"
AWS_REGION = ap-south-1
AWS_ACCESS_KEY_ID = ACCESSID
AWS_SECRET_ACCESS_KEY = accesspassword
AWS_BUCKET_NAME = sparrowcodinglabs
GITHUB_CLIENT_ID=clientid
GITHUB_CLIENT_SECRET=clientpassword
```

Build with docker and push to docker.io repository:

```
git clone https://github.com/UnpredictablePrashant/lms-backend-saas
cd lms-saas-backend
docker . build -t prashantdey/lms-backend-saas
docke
```

Deploying in the server

```
sudo docker pull prashantdey/lms-backend-saas
sudo docker run -p 3000:3000 -d prashantdey/lms-backend-saas
```

## Setting Reverse Proxy in Nginx

Install nginx and certbot.

```
sudo apt-get install nginx
```

Edit the file `/etc/nginx/sites-available/default` with the following content


```
server {
    server_name api.sparrowcodinglabs.com; # managed by Certbot

    # SSL configuration
    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/api.sparrowcodinglabs.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/api.sparrowcodinglabs.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    location / {
        proxy_pass http://localhost:3000; # Forward traffic to Express app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    if ($host = api.sparrowcodinglabs.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80 ;
    listen [::]:80 ;
    server_name api.sparrowcodinglabs.com;
    client_max_body_size 2000M;

    location / {
        proxy_pass http://localhost:3000; # Forward traffic to Express app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
