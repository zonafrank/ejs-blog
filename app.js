//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const _ = require("lodash");
const mongoose = require("mongoose");
const { Blog } = require("./models/blog");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const posts = [];
const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then((response) => {
    console.log("Connected to MongoDB database");
  })
  .catch((error) => {
    console.log(error);
  });

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (request, response) => {
  const posts = await Blog.find({});
  const postsToDisplay = posts.map((p) => {
    return {
      id: p._id.toString(),
      title: p.title,
      content: _.truncate(p.content, { length: 100 }),
    };
  });

  response.render("home", {
    homeStartingContent,
    posts: postsToDisplay,
  });
});

app.get("/posts/:id", async (request, response) => {
  const { id } = request.params;
  const requestedBlog = await Blog.findById(id);
  response.render("post", { post: requestedBlog });
});

app.get("/about", (request, response) => {
  response.render("about", { aboutContent });
});

app.get("/contact", (request, response) => {
  response.render("contact", { contactContent });
});

app.get("/compose", (request, response) => {
  response.render("compose");
});

app.post("/compose", async (request, response) => {
  const post = {
    title: request.body.postTitle,
    content: request.body.postContent,
    date: new Date(),
  };
  const newBlog = new Blog(post);
  await newBlog.save();
  response.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});
