const express = require("express");
const app = express();
const Post = require("./models/post");
const methodOverride = require("method-override");
const path = require("path");
const engine = require("ejs-mate");
var nl2br  = require('nl2br');

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blogly');
  console.log("Connected");
}

app.get("/", (req, res) => {
    res.send("Hello");
});

app.post("/posts", async (req, res) => {
    const {title, content} = req.body;
    const spaced = nl2br(content);
    const post = new Post({title, content, spaced});
    await post.save();
    res.redirect("/posts");
});

app.get("/posts", async (req, res) =>{
    const posts = await Post.find({});
    res.render("index", {posts});
});

app.get("/posts/new", (req, res) => {
    res.render("new");
});

app.get("/posts/:id", async(req, res) => {
    const {id} = req.params;
    const post = await Post.findById(id);
    res.render("show", {post});
});

app.put("/posts/:id", async (req, res) => {
    const {id} = req.params;
    const {title, content} = req.body;
    const spaced = nl2br(content);
    const post = await Post.findByIdAndUpdate(id, {title, content, spaced});
    res.redirect(`/posts/${post._id}`);
});

app.delete("/posts/:id", async(req, res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect("/posts");
});

app.get("/posts/:id/edit", async (req, res) => {
    const {id} = req.params;
    const post = await Post.findById(id);
    res.render("edit", {post});
});

app.listen(3000, () => {
    console.log("Listening");
});