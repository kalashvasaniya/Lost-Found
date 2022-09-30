const express = require("express");
const app = express();
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
app.post("/found", upload.single("image"), async (req, res, next) => {
  const { name, contact, email, itemName, location, ownerinfo, description } =
    req.body;
  imgurl = req.file.path;
  imgfilename = req.file.filename;
  let toUpload = new dataBase({
    name,
    contact,
    email,
    itemName,
    location,
    ownerinfo,
    description,
    image: [{ url: imgurl, filename: imgfilename }],
  });
  await toUpload.save();
  res.send(req.file);
});
app.listen(3000, () => {
  console.log("On Port 3000!!!");
});
