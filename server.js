const express = require("express");
const bodyParser = require("body-parser");
var jwt= require("jsonwebtoken");
var cors = require('cors')
const router = express.Router()
const app = express();
const middleware = require('./app/config/middleware')

// parse requests of content-type - application/x-www-form-urlencoded
// parse requests of content-type - application/json
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require('./app/config/auth.config')(app)
require("./app/routes/customer.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/post.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
