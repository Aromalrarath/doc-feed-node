const sql = require("./db.js");

const Post = function(posts) {
    this.description = posts.description;
    this.userId = posts.userId;
    this.createdAt = posts.createdAt;
    this.updatedAt = new Date();
    this.status = posts.status;
}

Post.create = (newPost, result) => {
    sql.query("INSERT INTO user_post SET ?", newPost, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newPost });   
    })
}

Post.getAll = result => {
  sql.query("SELECT * FROM user_post ORDER BY createdAt DESC", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Post.findPostsByUserId = (userId, result) => {
    sql.query(`SELECT * FROM user_post WHERE userId = ${userId} AND status='1' ORDER BY id DESC`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        result(null, res);
        return;
      }
  
      // not found Customer with the id
      result({ kind: "not_found" }, null);
    });
  };

  Post.updateById = (id,userId, post, result) => {
    sql.query(
      "UPDATE user_post SET description = ?, updatedAt = ? WHERE id = ? AND userId = ?",
      [post.description, post.updatedAt, id, userId],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Customer with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        // console.log("updated user: ", { id: id, ...post });
        result(null, { id: id,message:'Post details Updated !'});
      }
    );
  };

  Post.activateStatus = (id,status,result) => {
    sql.query( `UPDATE user_post SET status = '${status}' WHERE id = ${id}`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Customer with the id
          result({ kind: "not_found" }, null);
          return;
        }
        if(status==0)result(null, { id: id,message:'Post Deactivated !'});
        else result(null, { id: id,message:'Post Activated !'});
      }
    );
  };

module.exports = Post;