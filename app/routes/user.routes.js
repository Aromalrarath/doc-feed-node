module.exports = app =>{
    const users = require('../controllers/user.controller')
    const verify = require('../models/user.model')
    const middleware = require('../config/middleware')
    // Create a new User
    // app.post("/users", users.create);

    // Retrieve all Users
    app.get("/user/me", middleware.verify, (req, res)=>{
        verify.verify(res.user, (err, data) => {
            if (err) {
            } else res.send(data);
        });
    })

    // Retrieve all Users
    app.get("/users", middleware.verify, users.findAll);

    // Retrieve all Users except logged
    app.get("/users/all", middleware.verify, users.findWithoutOne);

    // Retrieve a single User with UserId
    app.get("/users/:userId", middleware.verify, users.findOne);

    // Update a User with UserId
    app.put("/users/:userId", middleware.verify,  users.update);

    // Delete a User with UserId
    app.delete("/users/:userId", middleware.verify,  users.delete);

    // Delete a User with UserId
    app.post("/user/login", middleware.verify,  users.login);
}