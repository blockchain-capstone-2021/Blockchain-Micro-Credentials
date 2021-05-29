# Project Structure Overview

## Backend

All backend and routing files are located in `/backend`

Follows a modifed MVC structure where there is no visible module section in this folder. All frontend rendering will be handled by React, the source files for which are located in `/frontend/src`. Communication between the two is via the Express API.

#### `/attachments`
Temporarily holds all attachments generated for the email service
#### `/bin`
Config folder for running the node app
#### `/blockchain`
Smart contracts and related code
 - `/build/contracts` Compiled JSON smart contract artifacts
 - `/contracts` Solidity smart contracts
 - `/migrations` All contract migration and deployment code
 - `/test` Smart contract tests
#### `/controllers`
The main application controllers supporting an MVC framework
#### `/db`
All code relevant to the mySQL database
 - `/config` Contains the database config file
 - `/controllers` Database controllers
 - `/migrations` Database migration files
 - `/models` Database models
 - `/seeders` Database data seeding files
#### `/exceptions`
Custom exceptions
#### `/middleware`
Communication with external services (blockchain and IPFS)
#### `/node_modules`
NPM packages
#### `/object_models`
Object models to be serialised and deserialised
 - `/blockchain` Key object models for blockchain tracker contracts
 - `/ipfs` Object models for IPFS storage
#### `/routes`
Provide access to the API through a predefined set of urls.
#### `/services`
Email service functionality
#### `/templates`
ejs templates for email attachment generation
#### `/test`
Backend Node.js test code
#### `/utilities`
Helper methods


## Frontend

All front end files are located in `/frontend`

#### `/node_modules`
NPM packages
#### `/public`
Images and public CSS files
#### `/src`
Folder containing all Node source files
 - `/apis` Creating connection to backend 
 - `/components` React components
     - `/dashboards` React components for dashboard pages 
     - `/login` React components for login pages
     - `/modules` React components for module pages
     - `/questions` React components for question pages
     - `/student` React components for student pages
     - `/templates` React components for templates
     - `/units` React components for unit pages
 - `/tests` Frontend Node.js test code
     - `/dashboards` Tests for dashboard components
     - `/login` Tests for login components
     - `/staff` Tests for module and question components
     - `/student` Tests for student components
     - `/units` Tests for unit components
 
**Tree structure**

```bash
.
├── attachments
├── backend
│   ├── attachments
│   ├── bin
│   ├── blockchain
│   │   ├── build
│   │   │   └── contracts
│   │   ├── contracts
│   │   ├── migrations
│   │   └── test
│   ├── controllers
│   ├── db
│   │   ├── config
│   │   ├── controllers
│   │   ├── migrations
│   │   ├── models
│   │   └── seeders
│   ├── exceptions
│   ├── middleware
│   ├── node_modules
│   ├── object_models
│   │   ├── blockchain
│   │   └── ipfs
│   ├── routes
│   ├── services
│   ├── templates
│   ├── test
│   └── utilities
├── frontend
│   ├── node_modules
│   ├── public
│   └── src
│       ├── apis
│       ├── components
│       │   ├── dashboards
│       │   ├── login
│       │   ├── modules
│       │   ├── questions
│       │   ├── student
│       │   ├── templates
│       │   └── units
│       └── tests
│           ├── dashboards
│           ├── login
│           ├── staff
│           ├── student
│           └── units
└── node_modules
```

# Installation

## Packages

The frontend, backend and root folders are standalone projects meaning that they each have their own package.json files. 

To install these, in the root folder run `npm install`. Also go into `/backend` and `/frontend` respectively and run `npm install`.

## Running

Please refer to the development guide documentation, and follow the included steps carefully.
