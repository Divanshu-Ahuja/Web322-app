const fs = require("fs");

let posts;
let categories;

const initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
      if (err) reject("unable to read file");
      posts = JSON.parse(data);
    });

    fs.readFile("./data/categories.json", "utf-8", (err, data) => {
      if (err) reject("unable to read file");
      categories = JSON.parse(data);
    });

    resolve("success");
  });
};

const getAllPosts = () => {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) reject("no results returned");
    resolve(posts);
  });
};

const getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter((post) => post.published === true);
    if (publishedPosts.length === 0) reject("no results returned");
    resolve(publishedPosts);
  });
};

const getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) reject("no results returned");
    resolve(categories);
  });
};

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories };
