const Post = require('../models/post.model')

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    // Create a User
    const post = new Post({
      description: req.body.description,
      userId: req.body.userId,
      createdAt: new Date(),
      status:1
    });
    // Save User in the database
    Post.create(post, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      else res.send(data);
    });
  };

  exports.findAll = (req, res) => {
    console.log("all")
    Post.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      else res.send(data);
    });
  };

exports.findPostsByUserId = (req, res) => {
  Post.findPostsByUserId(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.userId}.`,
          data:[]
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.userId
        });
      }
    } else res.send({status:200,data:data});
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  // console.log(req.body);
  if(req.body)req.body.updatedAt = new Date()
  Post.updateById(
    req.body.id,
    req.body.userId,
    new Post(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found`
          });
        } else {
          res.status(500).send({
            message: "Error on updating post"
          });
        }
      } else res.send(data);
    }
  );
};

exports.activateStatus = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  // console.log(req.body);

  Post.activateStatus(
    req.body.id,
    req.body.active_status,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found`
          });
        } else {
          res.status(500).send({
            message: "Error on updating post"
          });
        }
      } else res.send(data);
    }
  );
};