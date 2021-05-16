const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../../.env')
});
module.exports = {
    "development": {
        "username": process.env.DATABASE_USER,
        "password": process.env.DATABASE_PASSWORD,
        "database": "MicrocredentialDB",
        "host": "127.0.0.1",
        "port": 8080,
        "dialect": "mysql",
        "define": {
            timestamps: false
        }
    },
    "production": {
        "username": process.env.DATABASE_USER,
        "password": process.env.DATABASE_PASSWORD,
        "database": "MicrocredentialDB",
        "host": process.env.DATABASE_URL,
        "port": 3306,
        "dialect": "mysql",
        "define": {
            timestamps: false
        }
    }
};