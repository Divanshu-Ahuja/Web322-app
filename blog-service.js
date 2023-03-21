const fs = require("fs");

let posts = [];
let categories = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        posts = JSON.parse(data);

        fs.readFile("./data/categories.json", "utf8", (err, data) => {
          if (err) {
            reject(err);
          } else {
            categories = JSON.parse(data);
            resolve();
          }
        });
      }
    });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((resolve, reject) => {
    posts.length > 0 ? resolve(posts) : reject("no results returned");
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
    posts.length > 0
      ? resolve(posts.filter((post) => post.published))
      : reject("no results returned");
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    categories.length > 0 ? resolve(categories) : reject("no results returned");
  });
};

module.exports.addPost = function (postData) {
  return new Promise((resolve, reject) => {
    if (!postData.published) postData.published = false;
    postData.id = posts.length + 1;
    postData.category = Number(postData.category);
    postData.published = Boolean(postData.published);
    postData.postDate = new Date().toLocaleDateString("en-CA");
    posts.push(postData);
    resolve(postData);
  });
};

module.exports.getPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    const filteredPosts = [];
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].category === Number(category)) filteredPosts.push(posts[i]);
    }
    if (filteredPosts.length === 0) reject("no results returned");
    resolve(filteredPosts);
  });
};

module.exports.getPostsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    const filteredPosts = [];

    for (let i = 0; i < posts.length; i++) {
      if (new Date(posts[i].postDate) >= new Date(minDateStr)) {
        filteredPosts.push(posts[i]);
      }
    }
    if (filteredPosts.length === 0) reject("no results returned");
    resolve(filteredPosts);
  });
};

module.exports.getPostById = (id) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === Number(id)) {
        resolve(posts[i]);
      }
    }
    reject("no result returned");
  });
};

module.exports.getPublishedPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    posts.length > 0
      ? resolve(
          posts.filter((post) => post.published && post.category == category)
        )
      : reject("no results returned");
  });
};
