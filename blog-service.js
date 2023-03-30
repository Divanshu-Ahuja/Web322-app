const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "ocbzyadb",
  "ocbzyadb",
  "9dJpTm09itjNcprkVQ1yqwpR9ohOe_RA",
  {
    host: "ruby.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

const Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

const Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});

Post.belongsTo(Category, { foreignKey: "category" });

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => resolve())
      .catch((err) => {
        reject("unable to sync the database");
      });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll()
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
      },
    })
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.addPost = function (postData) {
  return new Promise((resolve, reject) => {
    postData.published = postData.published ? true : false;
    for (const property in postData) {
      if (postData[property] === "") postData[property] = null;
    }
    postData.postDate = new Date();

    Post.create(postData)
      .then(() => resolve())
      .catch((err) => reject("unable to create post"));
  });
};

module.exports.getPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        category: category,
      },
    })
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.getPostsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        postDate: {
          gte: new Date(minDateStr),
        },
      },
    })
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.getPostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        id: id,
      },
    })
      .then((data) => resolve(data[0]))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.getPublishedPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
        category: category,
      },
    })
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.addCategory = (categoryData) => {
  return new Promise((resolve, reject) => {
    for (const property in categoryData) {
      if (categoryData[property] === "") postData[property] = null;
    }

    Category.create(categoryData)
      .then(() => resolve())
      .catch((err) => reject("unable to create category"));
  });
};

module.exports.deleteCategoryById = (id) => {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: {
        id: id,
      },
    })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

module.exports.deletePostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: {
        id: id,
      },
    })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};
