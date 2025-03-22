# Project Name: JKTECH Assignment

This project is designed to demonstrate key concepts and practical implementation of file upload, ingestion, and storage using NestJS and PostgreSQL and AWS S3. It includes User login, authentication using JWT, file uploading to S3 with asynchronous processing, error handling, and ingestion status updates.


## Installation

Use the package manager npm to install foobar.

```bash
npm install
npm install --force
```

## Set up environment variables
Create a .env file in the root directory with the following content:

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

```
npm run start:dev
```


## Types of Users
#### 1 Admin
    Can perform all the tasks
    Can update role of any user
    List all the users
    Delete user
#### 2 Editor
  Can't update role
  
#### 3 Viewer
   Can see details of user by ID

## Note
1 Swagger documentation can be accessed : http://localhost:8080/api-docs#

## User Authentication
It is done using jwt token
route to handle register and login
```
http://localhost:8080/auth/register
http://localhost:8080/auth/login
```

## USER CRUD operation 
```
# get all user  (Admin)
http://localhost:8080/users

# get user by id (Admin, Editor, Viewer)
http://localhost:8080/users/:id

# update request (Admin, Editor)
http://localhost:8080/users/:id

#delete request (Admin)
http://localhost:8080/users/:id

#update role by id (Admin)
http://localhost:8080/users/role/:id


```

## Document S3 upload
```
#upload  (Editor and admin)
http://localhost:8080/files/upload

#list (Admin)
http://localhost:8080/files/list

# get by id (Admin, Editor, Viewer)
http://localhost:8080/files/:id

# delete by id (Admin)
http://localhost:8080/files/:id


```

## Ingestion
#### Ingestion management with status updates (Processing, Completed, Failed)
#### Asynchronous ingestion process


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

