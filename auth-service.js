const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});

let User;
module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(process.env.MONGO_URI);

    db.on("error", (err) => {
      reject(err);
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = (userData) => {
  const { password, password2 } = userData;
  return new Promise(function (resolve, reject) {
    if (password !== password2) reject("Passwords do not match");
    //
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        userData.password = hash;
        let newUser = new User(userData);
        newUser
          .save()
          .then(() => resolve())
          .catch((err) => {
            if (err.code === 11000) {
              reject("User Name already taken");
            } else {
              reject("There was an error creating the user: " + err);
            }
          });
      })
      .catch((err) => {
        reject("There was an error encrypting the password");
      });
  });
};
module.exports.checkUser = (userData) => {
  const { userName, password, userAgent } = userData;
  return new Promise(function (resolve, reject) {
    User.find({ userName })
      .then((user) => {
        if (user.length == 0) reject("Unable to find user: " + userName);
        else {
          // if (password === user[0].password) {
          bcrypt
            .compare(password, user[0].password)
            .then((result) => {
              if (result) {
                user[0].loginHistory.push({
                  dateTime: new Date().toString(),
                  userAgent,
                });
                User.updateOne(
                  { userName },
                  { $set: { loginHistory: user[0].loginHistory } }
                )
                  .exec()
                  .then(() => {
                    resolve(user[0]);
                  })
                  .catch((err) => {
                    reject("There was an error verifying the user: " + err);
                  });
              } else {
                reject("Wrong Credentials");
              }
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {
        reject("Unable to find user: " + userName);
      });
  });
};
