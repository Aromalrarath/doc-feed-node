const sql = require("./db.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const tokenSecret = "my-token-secret"

// constructor
const User = function(user) {
    this.firstName = user.firstName;
    this.middleName = user.middleName;
    this.lastName = user.lastName;
    this.username = user.username;
    this.mobile = user.mobile;
    this.email = user.email;
    this.passwordHash = user.passwordHash;
    this.registeredAt = user.registeredAt;
    this.intro = user.intro;
    this.profile = user.profile;
    this.token = user.token;
  };

User.create = (newUser, result) => {
  console.log("data",newUser)
  sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      // if(err==`Error: Duplicate entry '${newUser.email}' for key 'users.email_UNIQUE'`){
      //   err = "Email already exists"
      // }
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created User: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM user", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("users: ", res);
    result(null, res);
  });
};

User.findUsersWithoutMainUser = (userId, result) => {
  sql.query(`SELECT * FROM user WHERE id != ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

User.findById = (userId, result) => {
  sql.query(`SELECT * FROM user WHERE id = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    `UPDATE user SET firstName = ?, middleName = ?, lastName = ?, username = ?, mobile = ?, email = ?, intro = ?, profile = ? WHERE id = ${id}`,
    [user.firstName, user.middleName, user.lastName, user.username, user.mobile, user.email, user.intro, user.profile, id],

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

      // console.log("updated user: ", { id: id, ...user });
      result(null, { id: id,message:'User details Updated !'});
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM user WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

User.login = (user, result) =>{
  username = user.username
  password = user.password
  lastLogin = GetFormattedDate(new Date());
  sql.query('SELECT * FROM user WHERE username = ?',[username], async function (error, results, fields) {
    if (error) {
      result(null, { code: 400,success:'error ocurred'});
    }else{
      if(results.length >0){
        const comparision = await bcrypt.compare(password, results[0].passwordHash)
        if(comparision){
            sql.query( `UPDATE user SET token = '${generateToken(user)}', lastLogin='${lastLogin}' WHERE id = ${results[0].id}`,(err, res) => {
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
              // if(status==0)result(null, { id: id,message:'Post Deactivated !'});
              // else result(null, { id: id,message:'Post Activated !'});
            });
            console.log("user",result[0])
            result(null, { code:200, token: generateToken(user),message:'login sucessfull',id:results[0].id});
        }
        else{
          result(null, { code: 204,success:'Phone number and password does not match'});
        }
      }
      else{
        result(null, { code: 206,success:'Email does not exits'});
      }
    }
    });
}

User.verify = (user, result) =>{
  console.log("user",user)
  username = user.username
  password = user.password
  sql.query('SELECT * FROM user WHERE username = ?',[username], async function (error, results, fields) {
    if (error) {
      result(null, { code: 400,success:'error ocurred'});
    }else{
      if(results.length >0){
        const comparision = await bcrypt.compare(password, results[0].passwordHash)
        if(comparision){
            result(null, { code:200, message:'Verified Sucessfully',data:results[0]});
        }
        else{
          result(null, { code: 204,success:'Phone number and password does not match'});
        }
      }
      else{
        result(null, { code: 206,success:'Email does not exits'});
      }
    }
    });
}

function generateToken(user){
  return jwt.sign({data: user}, tokenSecret)
  // {expiresIn: '24h'}
}

function GetFormattedDate(date) {
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day  = ("0" + (date.getDate())).slice(-2);
  var year = date.getFullYear();
  var hour =  ("0" + (date.getHours())).slice(-2);
  var min =  ("0" + (date.getMinutes())).slice(-2);
  var seg = ("0" + (date.getSeconds())).slice(-2);
  return year + "-" + month + "-" + day + " " + hour + ":" +  min + ":" + seg;
}

module.exports = User;