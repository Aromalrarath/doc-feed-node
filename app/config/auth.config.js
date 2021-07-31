
const express = require('express')
const router = express.Router()
const middleware = require('./middleware')
const app = express();

module.exports = app =>{
    const users = require('../controllers/user.controller')
    // Create a new User
    app.post("/users", users.create);

    // Login a User with UserId
    app.post("/user/login", users.login);

    
}

