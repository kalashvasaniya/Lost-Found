if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/LostAndFound");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dataBase = require("./modules/userSchema");

const { storage } = require("./cloudinary");
const multer = require("multer");
const upload = multer({ storage });

const path = require("path");
const { url } = require("inspector");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/found", (req, res) => {
  res.render("found");
});
app.get("/lost", async (req, res) => {
  const userData = await dataBase.find({});
  res.render("lost", { userData });
});

app.get("/details/:id", async (req, res, next) => {
  const { id } = req.params;
  const userInfo = await dataBase.findById(id);
  console.log(userInfo);
  res.render("details", { userInfo });
});

app.post("/found", upload.single("image"), async (req, res, next) => {
  const { name, contact, email, itemName, location, description } = req.body;
  imgurl = req.file.path;
  imgfilename = req.file.filename;
  let toUpload = new dataBase({
    name,
    contact,
    email,
    itemName,
    location,
    description,
    image: [{ url: imgurl, filename: imgfilename }],
  });
  await toUpload.save();
  res.redirect('/');
});
app.listen(3000, () => {
  console.log("On Port 3000!!!");
});
