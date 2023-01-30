const express = require("express");
var path = require("path");
const app = express();
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
app.get("/", function (req, res) {
  res.send("Hello World<br /><a href='/about'>Go to the about page</a>");
});

app.get("/about", function (req, res) {
  res.sendFile(path.join(_dirname, "/views/about.html"));
});

app.listen(8080);
