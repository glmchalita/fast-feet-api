<h1 align="center" style="font-weight: bold;">FastFeet API 💻</h1>

<p align="center">
 <a href="#tech">Technologies</a> • 
 <a href="#started">Getting Started</a> • 
  <a href="#routes">API Endpoints</a>
</p>

<p align="center">
    <b>Development of a logistics platform for managing couriers, parcels, and recipients, ensuring the registration and tracking of each delivery stage.</b>
</p>

<h2 id="technologies">💻 Technologies</h2>

- Node.js
- TypeScript
- Nestjs
- Prisma (PostgreSQL)
- Redis
- Docker

<h2 id="started">🚀 Getting started</h2>

<h3>Prerequisites</h3>

Here you list all prerequisites necessary for running your project. For example:

- [NodeJS](https://nodejs.org/)
- [Docker](https://www.docker.com/)

<h3>Cloning</h3>

```bash
git clone https://github.com/glmchalita/fast-feet-api
```

<h3>Config .env variables</h3>

Use the `.env.example` file as a reference to create your `.env` configuration file with your Cloudflare credentials. First, create a bucket in R2 Object Storage, then generate an API token to obtain your Cloudflare credentials."

For generating JWT keys, run the command below, ensuring that all new lines are removed. (Windows users may need to install OpenSSL first.)

```bash
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 | tee >(openssl base64 -A > private_key_base64.txt) | openssl rsa -pubout | openssl base64 -A > public_key_base64.txt
```


```yaml
# Prisma (Use this URL if no changes are made in docker-compose.yml)
DATABASE_URL="postgresql://postgres:docker@localhost:5432/fast-feet-?schema=public"

# Auth (JWT)

JWT_PRIVATE_KEY=
JWT_PUBLIC_KEY=

# Upload (AWS /Cloudflare)
CLOUDFLARE_ACCOUNT_ID={YOUR_CLOUDFLARE_ID}
AWS_BUCKET_NAME={YOUR_BUCKET_NAME}
AWS_ACCESS_KEY_ID={YOUR_AWS_ACCESS_KEY}
AWS_SECRET_ACCESS_KEY={YOUR_AWS_SECRET}
```

<h3>Starting</h3>

Installing dependecies

```bash
cd fast-feet-api
npm install
```

Initializing database

```bash
docker compose up -d
```

Then you can start your project

```bash
npm start:dev
```

<h2 id="routes">📍 API Endpoints</h2>

This is just a preview of the API endpoints. For full details, please refer to the documentation.
​
| route               | description                                          
|----------------------|-----------------------------------------------------
| <kbd>GET /authenticate</kbd>     | retrieves user info
| <kbd>POST /authenticate</kbd>     | authenticate user into the api