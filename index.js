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

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

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

app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const data = await dataBase.findById(id);
  console.log(data);
  res.render("edit", { data });
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
app.post("/search", async (req, res) => {
  const { key } = req.body;
  console.log(key);
  dataBase.find(
    {
      itemName: { $regex: key, $options: "i" },
    },
    function (err, docs) {
      if (err) {
        console.log(err);
        return res.send("We Ran into an Error");
      } else {
        const userData = docs;
        console.log(userData);
        res.render("search", { userData, key });
      }
    }
  );
});
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deletedItem = await dataBase.findByIdAndDelete(id);
  res.redirect("/lost");
});
app.put("/edit/:id", upload.single("image"), async (req, res, next) => {
  const { id } = req.params;
  const { name, contact, email, itemName, location, description } = req.body;
  const imgurl = req.file.path;
  const imgfilename = req.file.filename;
  let toUpload = await dataBase.findByIdAndUpdate(id, {
    name,
    contact,
    email,
    itemName,
    location,
    description,
    image: [{ url: imgurl, filename: imgfilename }],
  });
  console.log("The New Info:: " + toUpload);
  res.redirect(`/details/${toUpload._id}`);
});
app.listen(3000, () => {
  console.log("On Port 3000!!!");
});
