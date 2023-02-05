var andi = require("./blog-service");
var path = require("path");
var express = require("express");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/categories", (req, res) => {
  andi
    .getallcategories()
    .then(function (categories) {
      res.json(categories);
    })
    .catch((glti) => {
      res.json("no results returned");
    });
});
// res.redirect();
// setup http server to listen on HTTP_PORT

// app.listen(HTTP_PORT, onHttpStart);
app.listen(HTTP_PORT, onHttpStart);
