/*
 * SOLUTION for AS2
 * DO NOT DELETE THIS COMMENT IF YOU ARE USING THIS SOLUTION - Harry
 */
/*********************************************************************************
 *  WEB322 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Divanshu Ahuja Student ID:150570216 Date: 22-02-2023
 *
 *  Cyclic Web App URL: https://tame-red-pelican-coat.cyclic.app/
 *
 *  GitHub Repository URL: https://github.com/Divanshu-Ahuja/Web322-app
 *
 ********************************************************************************/

const express = require("express");
const blogData = require("./blog-service");
const path = require("path");
const app = express();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const upload = multer();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/blog", (req, res) => {
  blogData
    .getPublishedPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/posts", (req, res) => {
  if (req.query.category)
    blogData
      .getPostsByCategory(req.query.category)
      .then((data) => res.json(data))
      .catch((err) => res.json({ message: err }));
  else if (req.query.minDate)
    blogData
      .getPostsByMinDate(req.query.minDate)
      .then((data) => res.json(data))
      .catch((err) => res.json({ message: err }));
  else
    blogData
      .getAllPosts()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
});

app.get("/post/:id", (req, res) => {
  blogData
    .getPostById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.json({ message: err }));
});

app.get("/posts/add", (req, res) => {
  res.sendFile(__dirname + "/views/addPost.html");
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processPost(uploaded.url);
    });
  } else {
    processPost("");
  }

  function processPost(imageUrl) {
    req.body.featureImage = imageUrl;

    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
    blogData.addPost(req.body);
    res.redirect("/posts");
  }
});

app.get("/categories", (req, res) => {
  blogData
    .getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

blogData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
