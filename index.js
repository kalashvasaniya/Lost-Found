const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/LostAndFound");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dataBase = require("./modules/userSchema");

const path = require("path");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/found", (req, res) => {
  res.render("found");
});

app.listen(3000, () => {
  console.log("On Port 3000!!!");
});
