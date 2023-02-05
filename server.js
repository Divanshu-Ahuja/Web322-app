require("./blog-service.js");
const express = require("express");

const {
  initialize,
  getCategories,
  getAllPosts,
  getPublishedPosts,
} = require("./blog-service.js");
const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.static("public"));

//
app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

app.get("/blog", (req, res) => {
  getPublishedPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/posts", (req, res) => {
  getAllPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/categories", (req, res) => {
  getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/views/404.html");
});
//

initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Express http server listening on", PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
