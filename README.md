# RolesNdPermissionCrud

## Env variables
1. PORT, 
2. DB, 
3. APP_SECRET, 
4. ADMIN_EMAIL_ID, 
5. ADMIN_PASSWORD

### Example 
PORT=8080\
DB=mongodb://localhost:27017/roles_nd_permissions_crud_services\
APP_SECRET=5a3ab7a7eeca5455337b25e6754f2fc311513709c686ee3efe311b3f3580bab4bd46bf3c055c55ce289782c8da3539c0d8d6ba7c53b360ee84c509d0d5b69e3e\
ADMIN_EMAIL_ID=test@gmail.com\
ADMIN_PASSWORD=Test@12345

## node version
14.19.1

## Setup Procedures

1. Create .env file in the root directory and assign all given environment variables in that file
2. Create a 'public' folder in root directory with 'profile-pic' folder 
3. Type "npm install" in the terminal
4. Type "npm run dev" to run in development environment
5. Type "npm run start" to run in production environment

## Features:
1. Default Admin account with a default "admin" role will be creation on when connecting to mongoDb
2. CRUD of roles with create, read, update, edit permissions which corresponds to CRUD of user
3. Default account can't be deleted.
4. Default role can't be deleted, edited.
5. Role based with permission described api access
6. Jwt authorization
7. One admin is maintained and which created by default
8. Hashed password. So remember the password of the users created.

## postman collection
[Link] (https://www.getpostman.com/collections/557f479d06ec4a450c99)