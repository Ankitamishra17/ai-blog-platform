const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");

async function addcomment(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(500).json({
        message: "Please enter the comment",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }
    //create comment
    const newComment = await Comment.create({
      comment,
      blog: id,
      user: creator,
    }).then((comment) => {
      return comment.populate({
        path: "user",
        select: "name email",
      });
    });

    await Blog.findByIdAndUpdate(id, {
      $push: { comments: newComment._id },
    });

    return res.status(200).json({
      success: true,
      message: " Comment added successfully",
      newComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function deletecomment(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(500).json({
        message: "comment is not found",
      });
    }

    if (!comment.user === userId && !comment.blog.creator === userId) {
      //error in this line
      return res.status(500).json({
        message: "you are not authorized ",
      });
    }

    await Blog.findByIdAndUpdate(comment.blog._id, { $pull: { comments: id } });
    await Comment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: " Comment delete successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function editcomment(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;
    const { updateComment } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(500).json({
        message: " comment is not found ",
      });
    }

    if (!comment.user == userId) {
      return res.status(400).json({
        success: false,
        message: " you are not valid user to edit comment",
      });
    }

    await Comment.findByIdAndUpdate(id, {
      comment: updateComment,
    });

    return res.status(200).json({
      success: true,
      message: " Comment edit successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function likecomment(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(500).json({
        message: "Comment is not found",
      });
    }

    if (!comment.likes.includes(userId)) {
      await Comment.findByIdAndUpdate(id, { $push: { likes: userId } });
      return res.status(200).json({
        success: true,
        message: "Comment Liked successfully ",
      });
    } else {
      await Comment.findByIdAndUpdate(id, { $pull: { likes: userId } });
      return res.status(200).json({
        success: true,
        message: "Comment Disliked successfully ",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function searchBlogs(req, res) {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const blogs = await Blog.find({
      draft: false,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    })
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  addcomment,
  deletecomment,
  editcomment,
  likecomment,
  searchBlogs,
};
