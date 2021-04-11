const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '../../.env')
})
module.exports = {
  "development": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": "MicrocredentialDB",
    "host": "127.0.0.1",
    "port": 8080,
    "dialect": "mysql"
  },
  "test": {
    "use_env_variable": "DATABASE_URL"
  },
  "production": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": "MicrocredentialDB",
    "host": "127.0.0.1",
    "port": 8080,
    "dialect": "mysql"
  }
}