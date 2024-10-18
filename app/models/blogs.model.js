const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      content: { type: String, required: true }, 
      author: { type: String, required: true },
      images: [{ url: String, caption: String,}],
      dateCreated: { type: Date, default: Date.now },
      isUpdated: { type: Date, }, 
      isPublished: { type: Boolean, default: false,}
    },
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog; 