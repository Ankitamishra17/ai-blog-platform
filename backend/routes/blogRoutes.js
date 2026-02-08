const express = require("express");
//import { createBlog, deleteBlog, getBlog, getBlogs, updateBlog, likeBlog,addcomment,deletecomment } from "../controllers/blogController";
const route = express.Router();
//const Blog = require("../models/blogSchema");

const {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
  likeBlog,
  
 
} = require("../controllers/blogController");

const verifyUser = require("../middlewares/auth");
const { addcomment,
   deletecomment,
    editcomment ,
    likecomment,
    searchBlogs} = require("../controllers/commentController");
const upload = require("../utils/multer");

//blog
route.post("/blogs",verifyUser, upload.single("image")  , createBlog);
route.get("/blogs",getBlogs);
route.get("/blogs/:blogId",getBlog);
route.patch("/blogs/:id",verifyUser,upload.single("image"), updateBlog);
route.delete("/blogs/:id", verifyUser, deleteBlog);

//like
route.post("/blogs/like/:id",verifyUser, likeBlog);

//comment
route.post("/blogs/comment/:id",verifyUser, addcomment);
route.delete("/blogs/comment/:id",verifyUser, deletecomment);
route.patch("/blogs/edit-comment/:id",verifyUser, editcomment);
route.patch("/blogs/like-comment/:id",verifyUser, likecomment);

//search
route.get("/search-blog", searchBlogs)

  
module.exports = route
