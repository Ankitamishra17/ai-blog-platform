// const { message } = require("antd");
const { unlink } = require("fs/promises");
const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");
const fs = require("fs");
const uniqueId = require("uniqueid");
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 10 });
//const { verifyJWT } = require("../utils/generateJWT");
const {
  uploadImage,
  deleteImagefromCloudinary,
} = require("../utils/uploadImage");

//verifyJWT

async function createBlog(req, res) {
  //console.log( req.body);
  try {
    //console.log("create Blog")

    //     let isValid = await verifyJWT(req.body.token);

    //     if(!isValid){
    //         return res.status(200).json({
    //             message:"Invalid Token"
    //         })
    //    }
    const creator = req.user;
    const { title, description, draft, content } = req.body;
    const image = req.file;
    console.log({ title, description });

    //  console.log({title, description,draft,image})

    if (!title) {
      return res.status(400).json({
        message: "Please fill title fields",
        blog,
      });
    }
    if (!description) {
      return res.status(400).json({
        message: "Please fill description fields ",
        blog,
      });
    }
    if (!content) {
      return res.status(400).json({
        message: "Please add some content ",
        blog,
      });
    }

    const findUser = await User.findById(creator);

    if (!findUser) {
      return res.status(500).json({
        message: "Invalid creator ID",
      });
    }

    //cloudinary setup
    const { secure_url, public_id } = await uploadImage(image.path);

    fs.unlinkSync(image.path);

    // const blogId = title.tolowerCase().replace(/ +/g, '-');
    //other method
    const blogId =
      title.toLowerCase().split(" ").join("-") + "-" + randomUUID();

    //    console.log(blogId + "-" + randomUUID());
    // const blogId = title.toLowerCase().split(" ").join("-")
    // console.log(blogId + "-" + randomUUID());

    const blog = await Blog.create({
      description,
      title,
      draft,
      creator,
      image: secure_url,
      imageId: public_id,
      blogId,
      content,
    });

    //await User.findByIdAndUpdate(creator, {$push: {blogs : blog._id}})

    return res.status(200).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getBlogs(req, res) {
  try {
    //const blogs = await Blog.find({draft : false}).populate("creator")
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ draft: false })
      .populate({
        path: "creator",
        // select:"name",
        select: "-password",
      })
      .populate({
        path: "likes",
        select: "email name",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalBlogs = await Blog.countDocuments({ draft: false });

    return res.status(200).json({
      message: "Blog fetched successfully",
      blogs,
      hasMore: skip + limit < totalBlogs,
      totalBlogs,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getBlog(req, res) {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findOne({ blogId })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "creator",
        select: "name email",
      });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      message: "Blog fetch successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function updateBlog(req, res) {
  try {
    const creator = req.user;
    const image = req.file;

    const { id } = req.params;
    const { title, description, draft } = req.body;

    const user = await User.findById(creator).select("-password");
    console.log(user);

    const blog = await Blog.findOne({ blogId: id });
    if (!(creator == blog.creator)) {
      return res.status(403).json({
        message: "you are not authorized for this action",
      });
    }
    if (image) {
      await deleteImagefromCloudinary(blog.imageId);
      //cloudinary setup
      const { secure_url, public_id } = await uploadImage(image.path);
      blog.image = secure_url;
      blog.imageId = public_id;
      fs.unlinkSync(image.path);
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.draft = draft || blog.draft;

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  //   const { id } = req.params;
  //   // let index = blogs.findIndex(blog => blog.id == id)
  //   // blogs[index] = {...blogs[index] , ...req.body}
  //   //console.log(blogs)
  //   //other method to update
  //   let updatedBlogs = blogs.map((blog, index) =>
  //     blog.id == id ? { ...blogs[index], ...req.body } : blog
  //   );

  //   blogs = [...updatedBlogs];
  //   return res.json({ message: "Blog updated successfully", updatedBlogs });
}

async function deleteBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    if (!(creator === blog.creator)) {
      return res.status(403).json({
        message: "you are not authorized for this action",
      });
    }

    await deleteImagefromCloudinary(blog.imageId);
    await Blog.findByIdAndDelete(id);
    await User.findByIdAndUpdate(creator, { $pull: { blogs: id } });

    return res.status(208).json({
      success: true,
      message: "Blog delete successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function likeBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    if (!blog.likes.includes(creator)) {
      await Blog.findByIdAndUpdate(id, { $push: { likes: creator } });
      return res.status(200).json({
        success: true,
        message: "Blog Liked successfully ",
        isLiked: true,
      });
    } else {
      await Blog.findByIdAndUpdate(id, { $pull: { likes: creator } });
      return res.status(200).json({
        success: true,
        message: "Blog Disliked successfully ",
        isLiked: false,
      });
    }

    // return res.status(208).json({
    //     success: true,
    //     message: "Blog delete successfully"
    // });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
};
