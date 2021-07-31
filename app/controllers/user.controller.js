const User = require('../models/user.model')
const bcrypt = require('bcrypt')

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.userId
        });
      }
    } else res.send(data);
  });
};

exports.findWithoutOne = (req, res) => {
  User.findUsersWithoutMainUser(req.query.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Users`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Users"
        });
      }
    } else res.send({data:data});
  });
};

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
  // Create a User
  const user = new User({
    
    firstName : req.body.firstName,
    middleName : req.body.middleName,
    lastName : req.body.lastName,
    username : req.body.username,
    mobile : req.body.mobile,
    email : req.body.email,
    passwordHash : hashedPassword,
    registeredAt : new Date(),
    intro : req.body.intro,
    profile : req.body.profile
  });
  console.log("data",user)
  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
  } catch (error) {
    res.status(500).send()
  }
};

// Update a User identified by the userId in the request
exports.update = async (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  // if(req.body&&req.body.password){
  //   const hashedPassword = await bcrypt.hash(req.body.password, 10)
  //   req.body.password = hashedPassword
  // }
  // console.log(req.body);

  User.updateById(
    req.params.userId,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id " + req.params.userId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.userId
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

exports.login = async (req, res) => {
  User.login(req.body, (err, data) => {
    if (err) {
    } else res.send(data);
  });
}

exports.verifyJwt = async (req, res) => {
  User.verify(req.body, (err, data) => {
    if (err) {
    } else res.send(data);
  });
}


// user_name: req.body.user_name,
// password:hashedPassword,
// ph_no: req.body.ph_no,
// email: req.body.email,
// dob: req.body.dob,
// bio: req.body.bio,
// relation_status: req.body.relation_status,
// address: req.body.address,
// high_school: req.body.high_school,
// university: req.body.university,
