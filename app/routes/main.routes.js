const express = require("express");
const app = express()

require('../config/auth.config')(app)
require("../routes/customer.routes.js")(app);
require("../routes/user.routes.js")(app);
require("../routes/post.routes")(app);