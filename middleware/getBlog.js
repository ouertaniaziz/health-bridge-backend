const express = require("express");
const Blog = require("../model/Blog");

// Middleware function to get blog by id
  const  getBlog = async (req, res, next) => {
  let blog;
  try {
    blog = await Blog.findById(req.params.id).populate("author", "name");
    if (blog == null) {
      return res.status(404).json({ message: "Blog not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.blog = blog;
  next();
}

module.exports =  getBlog ;
