const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String,
    content: String,
    spaced: String,
    likes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Post", PostSchema);