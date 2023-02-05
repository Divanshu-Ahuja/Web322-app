var fs = require("fs");

var categories = [];
var posts = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/categories.json", "utf8", (err, data) => {
      if (err) {
        reject("unable to read categories file");
      }
      categories = JSON.parse(data);
    });

    fs.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) {
        reject("unable to read posts file");
      }
      posts = JSON.parse(data);
      resolve();
    });
  });
};

module.exports.getallcategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length == 0) {
      reject("no results returned");
    } else {
      resolve(categories);
    }
  });
};

module.exports.getInternationalStudents = () => {
  return new Promise((resolve, reject) => {
    const internationalStudents = categories.filter(
      (catogeries) => student.isInternationalStudent === true
    );
    if (students.length == 0) {
      reject("no results returned");
    } else if (
      internationalStudents == false &&
      internationalStudents != true
    ) {
      reject("no results returned");
    } else {
      resolve(internationalStudents);
    }
  });
};

module.exports.getPrograms = () => {
  return new Promise((resolve, reject) => {
    if (programs.length == 0) {
      reject("no results returned");
    } else {
      resolve(programs);
    }
  });
};
