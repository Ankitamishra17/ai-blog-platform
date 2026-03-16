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

// helper function for safe blog slug
function generateSlug(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "") // remove special characters like /
      .trim()
      .split(" ")
      .join("-") +
    "-" +
    randomUUID()
  );
}

//verifyJWT

async function createBlog(req, res) {
  //console.log( req.body);
  try {
    const creator = req.user;
    const { title, description, draft, content } = req.body;
    const image = req.file;
    console.log({ title, description });

    //  console.log({title, description,draft,image})

    if (!title) {
      return res.status(400).json({
        message: "Please fill title fields",
        // blog,
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
    if (!image) {
      return res.status(400).json({ message: "Please upload blog image" });
    }

    const findUser = await User.findById(creator);

    if (!findUser) {
      return res.status(500).json({
        message: "Invalid creator ID",
      });
    }

    //cloudinary setup
    const { secure_url, public_id } = await uploadImage(image.path);
    // Optimize image
    const optimizedImage = secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto/",
    );

    fs.unlinkSync(image.path);

    // const blogId = title.tolowerCase().replace(/ +/g, '-');
    //other method
    const blogId = generateSlug(title);

    const blog = await Blog.create({
      description,
      title,
      draft,
      creator,
      image: optimizedImage,
      imageId: public_id,
      blogId,
      content,
    });
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
      .select("-content") // remove large content from list page

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
      .limit(limit)
      .lean();
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
    // const blog = await Blog.findByID(id);
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
}

async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    // const creator = req.user;
    // const creator = req.user.id;
    // const { id } = req.params;

    console.log("Delete blogId:", id);
    console.log("req.user:", req.user);
    console.log("req.user.id:", req.user?.id);
    // find blog using blogId
    //const blog = await Blog.findOne({ blogId: id });
    // const blog = await Blog.findById(id);
    const blog = await Blog.findOne({
      $or: [{ _id: id }, { blogId: id }],
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    console.log("blog.creator:", blog.creator.toString());

    // authorization check
    //if (blog.creator.toString() !== creator.toString()) {

    // if (creator !== blog.creator) {
    // if (blog.creator.toString() !== creator.toString()) {
    //   return res.status(403).json({
    //     message: "You are not authorized",
    //   });
    // }

    if (blog.creator.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "you are not authorized for this action",
      });
    }

    // delete image from cloudinary
    if (blog.imageId) {
      await deleteImagefromCloudinary(blog.imageId);
    }

    // delete blog
    //await Blog.deleteOne({ blogId: id });
    // await Blog.findByIdAndDelete(id);
    // await blog.deleteOne();
    await Blog.findByIdAndDelete(blog._id);

    // remove blog reference from user
    // await User.findByIdAndUpdate(creator, {
    //    $pull: { blogs: blog._id },
    // });

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { blogs: blog._id },
    });

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
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
