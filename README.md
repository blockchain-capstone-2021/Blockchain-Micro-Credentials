# Project Structure Overview

## Backend

All backend files are located in `/backend`

Holds all files for:
 - NodeJS backend
 - Blockchain code

Follows a modifed MVC structure where there is no visible module section in this folder. All frontend rendering will be handled by React, the source files for which are located in `/frontend/src`.

Express will be set up as an API for the blockchain microcredential platform with apis calls being made to and from the frontend.

### Database integration

The application uses Microsoft SQL Server to store application data used for basic operation.
Sequelize ORM is used to interact with the database from the backend to perform CRUD operations on all resources.

Database files can be found in `/backend/db`:
- `/config`
    - Holds all database configuration variables
- `/controllers`
    - Holds all the business processing logic.
- `/migrations`
    - Holds all database migration files. Note manual editing is required in some cases.
- `/models`
    - Holds all database models - the basic building blocks for the objects used by sequelize.
- `/seeders`
    - Holds any seed files that will generate mock data for the database

### Object Models 

This folder holds the object models that will be used for serialization and deserialization. These models will be used in storing data to IPFS and creating the keys for our mappings in the tracker contracts 

The folder is further divided into the below sub-directories:
- `/ipfs`
    - Holds all object models for IPFS storage configuration variables
- `/blockchain`
    - Holds all object models for the mapping keys.

### Controllers 

This directory holds all the controllers needed to pursue the Model-View-Framework our application. These controllers will be called from the express route file, which are triggered from the views.

### Blockchain

Blockchain specific files such as contract and build files will be stored here.

The folder is further divided into the below sub-directories:
- `/builds`
    - Holds all the compiled JSON artifacts of the smart contracts 
- `/contracts`
    - Holds all the solidity smart contracts.
- `/migrations`
- Holds all the migrations for the smart contracts.

Any truffle configrations can be made in `/backend/truffle-config.js`

### Middleware

Any logic making calls to third party libraries or apis should be stored here. This is done to provide some abstraction between application logic and the server's routing methods.

These files are stored in `/backend/middleware`.


### Routes

These provide access to the API through a predefined set of urls.

These are stored in `/backend/routes`.

*Note: Make sure to pass data to controllers for processing, if required, before sending back a response. Look at `/backend/routes/questions.js` as an example.*

## Frontend

All backend files are located in `/frontend`

### Components

All components will be kept in `/frontend/src`. These will serve as building blocks to render the web application.

#### Templates

Any template files to be used repeatedly (i.e. headers and footers) will:
 - Stored in `/frontend/src/components/templates`
 - Files names are prefixed with a _ (underscore) symbol. E.g. `_header.js`


 
**Tree structure**

*Note that the below is subject to change*

```bash
.
├── backend
│   ├── bin
│   ├── blockchain
│   │   ├── build
│   │   ├── contracts
│   │   └── migrations
│   ├── controllers
│   ├── db
│   │   ├── config
│   │   ├── controllers
│   │   ├── migrations
│   │   ├── models
│   │   └── seeders
│   ├── middleware
│   ├── object_models
│   │   ├── blockchain
│   │   └── ipfs
│   └── routes
└── frontend
    ├── public
    └── src
        ├── apis
        └── components
            └── templates
```


# Installation

## Packages

Both the frontend and backend folders are standalone projects meaning that they each have their own package.json files.

To install these, go into `/backend` and `/frontend` respectively and run `npm install`

## Running

### Backend

1. From root directory, cd into `/backend`.
2. To run:
    1. For mac users, run `npm run start-mac`
    2. For windows users, run `npm run start-windows`

### Frontend

1. From root directory, cd into `/frontend`.
2. run `npm run start`

Your default browser should open with the index page of the web app.
