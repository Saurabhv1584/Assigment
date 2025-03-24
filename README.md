# Project Name: JKTECH Assignment

This project is designed to demonstrate key concepts and practical implementation of file upload, ingestion, and storage using NestJS, PostgreSQL, and AWS S3. It includes user login, authentication using JWT, file uploading to S3 with asynchronous processing, error handling, and ingestion status updates.

## Installation

Use the package manager npm to install the dependencies.

```bash
npm install
npm install --force
```

## Set up environment variables

Create a `.env` file in the root directory with the following content:

```
APP_PORT=8080
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=#######
DATABASE_NAME=JKTECH_DB
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRATION=1h

AWS_ACCESS_KEY_ID=####
AWS_SECRET_ACCESS_KEY=####
AWS_REGION=region
AWS_S3_BUCKET_NAME=s3-bucket-name
```

## Start project in watch mode

```bash
npm run start:dev
```

## Types of Users

### 1. Admin
This user can perform any operations in the application such as:
- Registering new user
- CRUD of Document
- Create and get details of an Ingestion

### 2. Editor
This type of user can perform any operation on the document:
- Can upload files
- Can update user details
- Cannot update user roles

### 3. Viewer
This type of user can perform any operation on the document:
- Can view user details by ID

## User Authentication

User authentication is done using JWT tokens. The routes to handle registration and login are:

```
POST http://localhost:8080/auth/register
POST http://localhost:8080/auth/login
```

The codes for authentication can be found inside the gateway under the user module. Passport's JWT auth is used for this purpose. An Auth guard is placed on all those controller APIs which require the user to be authenticated. 

Please see these locations:
- `gateway/src/global/guards/jwt-auth.guard.ts`
- `gateway/src/user/services/auth/strategies/jwt/jwt.strategy.ts`


## User CRUD Operations

### Get all users (Admin)
```
GET http://localhost:8080/users
```

### Get user by ID (Admin, Editor, Viewer)
```
GET http://localhost:8080/users/:id
```

### Update user by ID (Admin, Editor)
```
PUT http://localhost:8080/users/:id
```

### Delete user by ID (Admin)
```
DELETE http://localhost:8080/users/:id
```

### Update user role by ID (Admin)
```
PUT http://localhost:8080/users/role/:id
```

## Document S3 Upload

### Upload file (Editor and Admin)
```
POST http://localhost:8080/files/upload
```

### List files (Admin)
```
GET http://localhost:8080/files/list
```

### Get file by ID (Admin, Editor, Viewer)
```
GET http://localhost:8080/files/:id
```

### Delete file by ID (Admin)
```
DELETE http://localhost:8080/files/:id
```

## Mocked Ingestion Service

The ingestion service is another NestJS microservice that runs along with the gateway. It has APIs to add and get details of the ingestion as `@MessagePattern` with linked to their command.

NOTE: 
Once a new ingestion is added, to update its status an event is fired. That event is then asynchronously handled to update its status to success/failed.

## Swagger Documentation

Swagger documentation can be accessed at:
```
http://localhost:8080/api-docs#
```

## Note

1. Ensure that the environment variables are correctly set up in the `.env` file.
2. The project uses NestJS for building efficient and scalable server-side applications.
3. PostgreSQL is used as the database for storing user and document information.
4. AWS S3 is used for file storage and management.